import { InMemoryDbService } from "angular-in-memory-web-api";

import { NamedColorData } from "./named-colors.data";

export class AppData implements InMemoryDbService {

  createDb() {
    const namedColors = NamedColorData.namedColors;
    
    return { namedColors };
  }
}