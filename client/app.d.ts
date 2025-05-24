import "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      bind: [() => any, (v: any) => any];
    }
  }
}
