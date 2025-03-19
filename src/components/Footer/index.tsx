import { siteConfig } from "@/config/site";

export const Footer = () => {
  return (
    <footer
      className="p-4 text-center text-white"
      style={{
        background:
          "linear-gradient(to right, #3D7CB6 0%, #349BD1 5%, #38B8EA 20%, #38B8EA 80%, #349BD1 95%, #3D7CB6 100%)",
      }}
    >
      {/* 利用規約 */}
      <a href={siteConfig.footer.links[0].href} className="mx-4 hover:underline">
        {siteConfig.footer.links[0].text}
      </a>
      {/* Youtube */}
      <a href={siteConfig.footer.links[1].href} className="mx-4 hover:underline">
        {siteConfig.footer.links[1].text}
      </a>
      {/* 公式HP */}
      <a href={siteConfig.footer.links[2].href} className="mx-4 hover:underline">
        {siteConfig.footer.links[2].text}
      </a>
    </footer>
  );
};
