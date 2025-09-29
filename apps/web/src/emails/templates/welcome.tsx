import { Footer } from "@/emails/components/footer";
import { Logo } from "@/emails/components/logo";
import { OutlineButton } from "@/emails/components/outline-button";
import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function WelcomeEmail({
  name = "there",
}: {
  name: string;
}) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Geist Mono"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&display=swap",
            format: "woff2",
          }}
          fontWeight={500}
          fontStyle="normal"
        />
      </Head>
      <Preview>Welcome to Trans! Let's get started.</Preview>
      <Tailwind>
        <Body className="bg-white font-mono">
          <Container className="mx-auto py-5 pb-12 max-w-[580px]">
            <Logo />

            <Text className="text-sm leading-7 mb-6 font-mono">
              Hi {name}, welcome to Trans!
            </Text>

            <Text className="text-sm leading-7 pb-2 font-mono">
              We're excited to help you automate your localization workflow.
              Here's what you can do with Trans:
            </Text>

            <Text className="text-sm font-mono">
              <span className="text-lg">◇ </span>
              Automatically detect and extract text that needs translation
            </Text>
            <Text className="text-sm font-mono">
              <span className="text-lg">◇ </span>
              Translate your content into multiple languages with AI
            </Text>
            <Text className="text-sm font-mono">
              <span className="text-lg">◇ </span>
              Keep translations in sync with your codebase
            </Text>
            <Text className="text-sm font-mono">
              <span className="text-lg">◇ </span>
              Collaborate with your team in real-time
            </Text>

            <Section className="mb-20 mt-8">
              <OutlineButton
                className="mr-6"
                variant="default"
                href="https://trans.ai"
              >
                Start Automating
              </OutlineButton>

              <OutlineButton variant="secondary" href="https://trans.ai/docs">
                Read the Docs
              </OutlineButton>
            </Section>

            <Section className="mt-8">
              <Text className="text-sm leading-7 mb-6 font-mono text-[#707070]">
                If you have any questions, feel free to reach out to us at{" "}
                <Link
                  href="mailto:support@khulnasoft.com"
                  className="underline text-black font-mono"
                >
                  support@khulnasoft.com
                </Link>
              </Text>
            </Section>

            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
