import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { Parser, Quad, DataFactory } from "n3";
import { toast } from "react-toastify";

const { namedNode } = DataFactory;

class ExtendedProfile {
  webId: string;
  quads: Quad[];

  constructor(webId: string, quads: Quad[]) {
    this.webId = webId;
    this.quads = quads;
  }

  getName(): string {
    let names = this.quads.filter(q => q.subject.equals(namedNode(this.webId)) && q.predicate.equals(namedNode('http://xmlns.com/foaf/0.1/name'))).map(q => q.object.value);
    return names.length > 0 ? names[0] : '';
  }

  getImage(): string {
    let images = this.quads.filter(q => q.subject.equals(namedNode(this.webId)) && q.predicate.equals(namedNode('http://xmlns.com/foaf/0.1/img'))).map(q => q.object.value);
    return images.length > 0 ? images[0] : '';
  }

  getPublicTypeIndex(): TypeIndex {
    let indexes = this.quads.filter(q => q.subject.equals(namedNode(this.webId)) && q.predicate.equals(namedNode('http://www.w3.org/ns/solid/terms#publicTypeIndex'))).map(q => q.object.value);
    return new TypeIndex();
  }
}

class TypeIndex {

}

export async function getExtendedProfile(webId: string): Promise<Quad[]> {
  let profileQuads = await getResource(webId);
  let sameAsProfiles = await Promise.all(profileQuads.filter(q => q.subject.equals(namedNode(webId)) && q.predicate.equals(namedNode('http://www.w3.org/2002/07/owl#sameAs'))).map(q => getResource(q.object.value)));
  let seeAlsoProfiles = await Promise.all(profileQuads.filter(q => q.subject.equals(namedNode(webId)) && q.predicate.equals(namedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'))).map(q => getResource(q.object.value)));
  let preferenceFiles = await Promise.all(profileQuads.filter(q => q.subject.equals(namedNode(webId)) && q.predicate.equals(namedNode('http://www.w3.org/ns/pim/space#preferencesFile'))).map(q => getResource(q.object.value)));

  return profileQuads;
}

async function getResource(uri: string): Promise<Quad[]> {
  return new Promise(function(resolve, reject) {
    const parser = new Parser({
      baseIRI: uri
    });

    let quads: Quad[] = [];
    getDefaultSession().fetch(uri)
      .then(res => res.text())
      .then(text => parser.parse(text, (error, quad) => {
          if(error) {
            toast.error(error.message);
            reject(error);
          } else if(quad) {
            quads.push(quad);
          } else {
            resolve(quads);
          }
      }))
      .catch(error => {
        toast.error(error.message);
        reject(error);
      });
  });
}