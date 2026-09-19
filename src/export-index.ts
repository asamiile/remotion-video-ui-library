import { Internals, registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

// The batch exporter reads actual Studio folders rather than a second ID-prefix map.
declare global {
  interface Window {
    getExportFolders: () => { id: string; folder: string }[];
  }
}
window.getExportFolders = () =>
  (Internals.compositionsRef.current?.getCompositions() ?? []).map((c) => ({
    id: c.id,
    folder: [c.parentFolderName, c.folderName].filter(Boolean).join("/"),
  }));
registerRoot(RemotionRoot);
