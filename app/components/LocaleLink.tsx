import type { RemixLinkProps } from "@remix-run/react/components";
import { Link, useParams } from "remix";

/**
 * Get a link with the current locale parameter
 * @returns A localized <Link>
 */
export const LocaleLink: React.FC<
  RemixLinkProps & React.RefAttributes<HTMLAnchorElement>
> = ({ children, ...args }) => {
  const { locale } = useParams();

  return (
    <Link {...args} to={`/${locale}${args.to}`}>
      {children}
    </Link>
  );
};
