import { useAtom } from "jotai";
import { changelogAtom } from "@/state/atoms";
import { CURRENT_APP_VERSION } from "@/utils/constants";

const useChangelog = () => {
  const [changelog, setChangelog] = useAtom(changelogAtom);

  const markChangelogAsRead = () => {
    setChangelog(CURRENT_APP_VERSION);
  };

  return {
    changelog,
    markChangelogAsRead,
  };
};

export { useChangelog };
