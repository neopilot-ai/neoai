import { getEmailUrl } from "@neoai/utils/envs";
import {
  Column,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { LogoFooter } from "./logo-footer";
import { getEmailInlineStyles, getEmailThemeClasses } from "./theme";

const baseUrl = getEmailUrl();

export function Footer() {
  const themeClasses = getEmailThemeClasses();
  const lightStyles = getEmailInlineStyles("light");

  return (
    <Section className="w-full">
      <Hr
        className={themeClasses.border}
        style={{ borderColor: lightStyles.container.borderColor }}
      />

      <br />

      <Text
        className={`text-[21px] font-regular ${themeClasses.text}`}
        style={{ color: lightStyles.text.color }}
      >
        Run your business smarter.
      </Text>

      <br />

      <Row>
        <Column
          style={{ width: "33%", paddingRight: "10px", verticalAlign: "top" }}
        >
          <Text
            className={`font-medium ${themeClasses.text}`}
            style={{ color: lightStyles.text.color }}
          >
            Features
          </Text>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/bOp4NOx"
            style={{ color: lightStyles.mutedText.color }}
          >
            Overview
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/VFcNsmQ"
            style={{ color: lightStyles.mutedText.color }}
          >
            Inbox
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/uA06kWO"
            style={{ color: lightStyles.mutedText.color }}
          >
            Vault
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/x7Fow9L"
            style={{ color: lightStyles.mutedText.color }}
          >
            Tracker
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/fkYXc95"
            style={{ color: lightStyles.mutedText.color }}
          >
            Invoice
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/dEnP9h5"
            style={{ color: lightStyles.mutedText.color }}
          >
            Pricing
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://neoai.khulnasoft.com/download"
            style={{ color: lightStyles.mutedText.color }}
          >
            Download
          </Link>
        </Column>

        <Column
          style={{ width: "33%", paddingRight: "10px", verticalAlign: "top" }}
        >
          <Text
            className={`font-medium ${themeClasses.text}`}
            style={{ color: lightStyles.text.color }}
          >
            Resources
          </Text>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/fhEy5CL"
            style={{ color: lightStyles.mutedText.color }}
          >
            Homepage
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://git.new/neoai"
            style={{ color: lightStyles.mutedText.color }}
          >
            Github
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/ZrhEMbR"
            style={{ color: lightStyles.mutedText.color }}
          >
            Support
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/rofdWKi"
            style={{ color: lightStyles.mutedText.color }}
          >
            Terms of service
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/TJIL5mQ"
            style={{ color: lightStyles.mutedText.color }}
          >
            Privacy policy
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/IQ1kcN0"
            style={{ color: lightStyles.mutedText.color }}
          >
            Branding
          </Link>
        </Column>

        <Column style={{ width: "33%", verticalAlign: "top" }}>
          <Text
            className={`font-medium ${themeClasses.text}`}
            style={{ color: lightStyles.text.color }}
          >
            Company
          </Text>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/186swoH"
            style={{ color: lightStyles.mutedText.color }}
          >
            Story
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/QWyX8Um"
            style={{ color: lightStyles.mutedText.color }}
          >
            Updates
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/Dd7M8cl"
            style={{ color: lightStyles.mutedText.color }}
          >
            Open startup
          </Link>
          <Link
            className={`text-[14px] block mb-1.5 ${themeClasses.mutedLink}`}
            href="https://go.neoai.khulnasoft.com/M2Hv420"
            style={{ color: lightStyles.mutedText.color }}
          >
            OSS Friends
          </Link>
        </Column>
      </Row>

      <br />
      <br />

      <Row>
        <Column className="align-middle w-[40px]">
          <Link href="https://go.neoai.khulnasoft.com/lS72Toq">
            <Img
              src={`${baseUrl}/email/x.png`}
              width="18"
              height="18"
              alt="Neoai on X"
            />
          </Link>
        </Column>
        <Column className="align-middle w-[40px]">
          <Link href="https://go.neoai.khulnasoft.com/7rhA3rz">
            <Img
              src={`${baseUrl}/email/producthunt.png`}
              width="22"
              height="22"
              alt="Neoai on Producthunt"
            />
          </Link>
        </Column>
        <Column className="align-middle">
          <Link href="https://go.neoai.khulnasoft.com/Ct3xybK">
            <Img
              src={`${baseUrl}/email/linkedin.png`}
              width="22"
              height="22"
              alt="Neoai on LinkedIn"
            />
          </Link>
        </Column>
      </Row>

      <br />
      <br />

      <Text
        className={`text-xs ${themeClasses.secondaryText}`}
        style={{ color: lightStyles.secondaryText.color }}
      >
        Neoai Labs AB - Torsgatan 59 113 37, Stockholm, Sweden.
      </Text>

      <Link
        className={`text-[14px] block ${themeClasses.mutedLink}`}
        href="https://app.neoai.khulnasoft.com/settings/notifications"
        title="Unsubscribe"
        style={{ color: lightStyles.mutedText.color }}
      >
        Notification preferences
      </Link>

      <br />
      <br />

      <LogoFooter />
    </Section>
  );
}
