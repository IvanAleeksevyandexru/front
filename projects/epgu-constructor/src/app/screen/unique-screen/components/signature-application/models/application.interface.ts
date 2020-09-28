export interface SignatureApplicationAttr {
  actions: Actions[];
  image: { src: string };
}

interface Actions {
  label: string;
  value: string;
  action: string;
}
