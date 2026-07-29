import "./index.css";
import { TextFolder } from "./root-text";
import { BackgroundFolder } from "./root-background";
import { EffectFolder } from "./root-effect";
import { UIFolder } from "./root-ui";
import { OtherFolder } from "./root-other";
import { OneTakeFolder } from "./root-onetake";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <TextFolder />
      <BackgroundFolder />
      <EffectFolder />
      <UIFolder />
      <OtherFolder />
      <OneTakeFolder />
    </>
  );
};
