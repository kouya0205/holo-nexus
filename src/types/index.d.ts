export type HomeConfig = {
  top: {
    ads: { src: string; alt: string }[];
  };
  middle: {
    items: { src: string; alt: string; title: string }[];
  };
  bottom: {
    ads: { src: string; alt: string }[];
  };
  works: Artwork[];
};

export type SiteConfig = {
  title: string;
  description: string;
  url: string;
  header: {
    title: string;
    logo: string;
    icons: { src: string; alt: string }[];
  };
  footer: {
    links: { href: string; text: string }[];
  };
  cardList: {
    title: string;
    description: string;
    url: string;
  };
  deckCreate: {
    title: string;
    description: string;
    url: string;
  };
  deckList: {
    title: string;
    description: string;
    url: string;
  };
  auth: {
    title: string;
    description: string;
    url: string;
  };
  profile: {
    title: string;
    description: string;
    url: string;
  };
};

export type AuthConfig = {
  tab: {
    login: string;
    signup: string;
  };
  login: {
    title: string;
    description: string;
    button: string;
    email: {
      label: string;
      placeholder: string;
    };
    password: {
      label: string;
      placeholder: string;
    };
  };
  signup: {
    title: string;
    description: string;
    button: string;
    email: {
      label: string;
      placeholder: string;
    };
    username: {
      label: string;
      placeholder: string;
    };
    password: {
      label: string;
      placeholder: string;
    };
    confirmPassword: {
      label: string;
      placeholder: string;
    };
  };
};

export type TabConfig = {
  tab: { id: string; label: string }[];
  deck_create: { id: string; label: string }[];
};

export type Profile = {
  id: string | undefined;
  username: string | undefined;
  email: string;
  avatar_url: string | undefined;
};

export type EditedProfile = {
  username: string | undefined;
  avatar_url: string | undefined;
};

export type CardConfig = {
  types: { title: string; id: number }[];
  rarity: { title: string; id: number }[];
  cards: {
    card_id: string;
    card_name: string;
    card_number: string;
    rarity: string;
    color: string;
    created_at: string;
    updated_at: string;
    image_url: string | null;
    type: string | null;
    type_list: { title: string; id: number }[];
    buzzholomencards: {
      hp: number;
      extra: boolean;
      card_id: string;
      debut_stage: string;
    } | null;
    holomencards: {
      hp: number;
      extra: boolean;
      card_id: string;
      debut_stage: string;
    } | null;
    oshiholomencards: { card_id: string; life_count: number } | null;
    release_deck: string | null;
  }[];
  release_deck: { id: number; title: string; name: string }[];
  colors: { title: string; id: number; value: string }[];
  oshi_colors: { title: string; id: number; value: string }[];
  support_type: { id: number; value: string; name: string }[];
};
