import { useTranslation } from "react-i18next";
import { IntroductionPopover } from "@components/organisms/introductionPopover";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="w-full p-1 md:px-2">
      <div className="flex flex-row items-center gap-3 md:h-12 md:flex-row">
        <IntroductionPopover />
        <p className="text-muted-foreground text-center text-sm leading-loose text-balance md:text-left">
          {t("built_by")}{" "}
          <a
            href={siteConfig.links.portfolio}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Michelle
          </a>
          . {t("code_available_on")}{" "}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
