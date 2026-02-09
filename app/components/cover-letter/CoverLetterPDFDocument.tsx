import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { CoverLetterContent, CoverLetterTemplate } from "@/types";

interface CoverLetterPDFDocumentProps {
  content: CoverLetterContent;
  template: CoverLetterTemplate;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: "#1e293b",
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.7,
    paddingTop: 54,
    paddingRight: 54,
    paddingBottom: 54,
    paddingLeft: 54,
    position: "relative",
  },
  leftBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  topBar: {
    height: 6,
    width: "100%",
    marginBottom: 12,
  },
  header: {
    marginBottom: 8,
  },
  nameBold: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 2,
    lineHeight: 1.2,
  },
  nameSemiBold: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 2,
    lineHeight: 1.2,
  },
  title: {
    color: "#475569",
    fontSize: 11,
    fontWeight: 500,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  contactStack: {
    flexDirection: "column",
  },
  contactItem: {
    color: "#64748b",
    fontSize: 9,
    marginRight: 8,
    marginBottom: 2,
  },
  separator: {
    color: "#94a3b8",
    fontSize: 9,
    marginRight: 6,
    marginBottom: 2,
  },
  underlineBar: {
    width: 80,
    height: 3,
    marginTop: 8,
  },
  horizontalRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginTop: 4,
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  bodyParagraph: {
    marginBottom: 10,
  },
  closingBlock: {
    marginTop: 4,
  },
  sincerely: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: 500,
  },
  signature: {
    fontWeight: 600,
  },
});

function ContactList({
  contactItems,
  stacked,
}: {
  contactItems: string[];
  stacked: boolean;
}) {
  if (stacked) {
    return (
      <View style={styles.contactStack}>
        {contactItems.map((item, index) => (
          <Text key={`${item}-${index}`} style={styles.contactItem}>
            {item}
          </Text>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.contactRow}>
      {contactItems.map((item, index) => (
        <View
          key={`${item}-${index}`}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          {index > 0 && <Text style={styles.separator}>{"\u00b7"}</Text>}
          <Text style={styles.contactItem}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function CoverLetterPDFDocument({
  content,
  template,
}: CoverLetterPDFDocumentProps) {
  const { header, date, recipientName, opening, bodyParagraphs, closing, signature } =
    content;
  const isStacked = template.headerLayout === "stacked";
  const contactItems = [header.email, header.phone, header.location, header.linkedin]
    .filter(Boolean)
    .map((item) => String(item));

  return (
    <Document title="Cover Letter" language="en-US">
      <Page size="LETTER" style={styles.page}>
        {template.accentBarVariant === "left-bar" && (
          <View
            style={[styles.leftBar, { backgroundColor: template.accentColor }]}
          />
        )}

        {template.accentBarVariant === "top-bar" && (
          <View
            style={[styles.topBar, { backgroundColor: template.accentColor }]}
          />
        )}

        <View style={styles.header}>
          <Text
            style={[
              template.fontWeight === "bold" ? styles.nameBold : styles.nameSemiBold,
              { color: template.accentColor },
            ]}
          >
            {header.fullName}
          </Text>
          <Text style={styles.title}>{header.title}</Text>
          <ContactList contactItems={contactItems} stacked={isStacked} />
          {template.accentBarVariant === "underline" && (
            <View
              style={[styles.underlineBar, { backgroundColor: template.accentColor }]}
            />
          )}
        </View>

        <View style={styles.horizontalRule} />

        <View style={styles.section}>
          <Text>{date}</Text>
          <Text style={{ marginTop: 8, fontWeight: 500 }}>Dear {recipientName},</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bodyParagraph}>{opening}</Text>
          {bodyParagraphs.map((paragraph, index) => (
            <Text key={`${paragraph.slice(0, 24)}-${index}`} style={styles.bodyParagraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        <View style={styles.closingBlock}>
          <Text>{closing}</Text>
          <Text style={styles.sincerely}>Sincerely,</Text>
          <Text style={[styles.signature, { color: template.accentColor }]}>
            {signature}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
