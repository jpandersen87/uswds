/// <reference types="vite/client" />

declare module "receptor/keymap";

declare module "receptor/behavior" {
  import objectAssign from "object-assign";

  export default function behavior<E, P>(
    events: E,
    props: P
  ): {
    add: <E extends HTMLElement>(element: E) => void;
    remove: <E extends HTMLElement>(element: E) => void;
  } & P;
}

declare module "receptor" {
  import behavior from "receptor/behavior";

  export { behavior };
}
