export const metadata = {
  title: "How We See Each Other 💜",
  description: "A 9-square moodboard for the person you love",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
