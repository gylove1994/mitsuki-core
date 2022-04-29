import { MitsukiFactory } from "../core/mitsuki-core";
import { FirstModule } from "./module";


async function setup() {
  const mitsuki = MitsukiFactory(FirstModule);
}

setup()
