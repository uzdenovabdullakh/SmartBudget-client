type FaviconProps = {
  name: string;
};

const Favicon = ({ name }: FaviconProps): JSX.Element => {
  return (
    <>
      <link
        rel="icon"
        type="image/png"
        href="/favicon-96x96.png"
        sizes="96x96"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      {/*  eslint-disable-next-line react/no-invalid-html-attribute */}
      <link rel="shortcut icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <meta name="apple-mobile-web-app-title" content="Smart Budget" />
      <link rel="manifest" href="/site.webmanifest" />
    </>
  );
};

export default Favicon;
