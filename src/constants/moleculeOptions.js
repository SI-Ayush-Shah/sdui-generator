import json from "../sdui-schema.json";
import {
  RADIUS_OPTIONS,
  TYPOGRAPHY_OPTIONS,
  GRADIENT_OPTIONS,
  ATOM_TYPES,
} from "./atomOptions";

// Export atom options that are also applicable to molecules
export { RADIUS_OPTIONS, TYPOGRAPHY_OPTIONS, GRADIENT_OPTIONS };

// Molecule name options from the component map
export const MOLECULE_NAMES = [
  { value: "molecule_section_header", label: "molecule_section_header" },
  { value: "molecule_footer_action", label: "molecule_footer_action" },
  { value: "molecule_article_extension", label: "molecule_article_extension" },
  { value: "molecule_article_thumbnail", label: "molecule_article_thumbnail" },
  {
    value: "molecule_article_description",
    label: "molecule_article_description",
  },
  {
    value: "molecule_fixturecard_matchinfo",
    label: "molecule_fixturecard_matchinfo",
  },
  {
    value: "molecule_fixturecard_meta_extension",
    label: "molecule_fixturecard_meta_extension",
  },
  {
    value: "molecule_fixturecard_scores_cricket",
    label: "molecule_fixturecard_scores_cricket",
  },
  {
    value: "molecule_fixturecard_action_extension",
    label: "molecule_fixturecard_action_extension",
  },
  { value: "molecule_fixture_meta_data", label: "molecule_fixture_meta_data" },
  { value: "molecule_player_extension", label: "molecule_player_extension" },
  { value: "molecule_player_data", label: "molecule_player_data" },
  { value: "molecule_player_detail", label: "molecule_player_detail" },
  { value: "molecule_player_thumbnail", label: "molecule_player_thumbnail" },
];

// Molecule-specific options
export const MOLECULE_TYPES = [
  { value: "card", label: "Card" },
  { value: "button", label: "Button" },
  { value: "input", label: "Input" },
  { value: "navigation", label: "Navigation" },
  { value: "media", label: "Media" },
  { value: "content", label: "Content Block" },
  { value: "layout", label: "Layout" },
  { value: "container", label: "Container" },
];

export const LAYOUT_TYPES = [
  { value: "flex", label: "Flex" },
  { value: "grid", label: "Grid" },
  { value: "table", label: "Table" },
];

export const CONTAINER_TYPES = [
  { value: "section", label: "Section" },
  { value: "div", label: "Div" },
  { value: "article", label: "Article" },
  { value: "header", label: "Header" },
  { value: "footer", label: "Footer" },
];

export const ALIGNMENT_OPTIONS = [
  { value: "start", label: "Start" },
  { value: "center", label: "Center" },
  { value: "end", label: "End" },
  { value: "between", label: "Space Between" },
  { value: "around", label: "Space Around" },
  { value: "evenly", label: "Space Evenly" },
];

// These are just some common variants that could be used across different molecule types
export const VARIANT_OPTIONS = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "tertiary", label: "Tertiary" },
  { value: "ghost", label: "Ghost" },
  { value: "outline", label: "Outline" },
  { value: "text", label: "Text Only" },
];

// Sub variant options for molecules
export const SUB_VARIANT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "compact", label: "Compact" },
  { value: "expanded", label: "Expanded" },
  { value: "outlined", label: "Outlined" },
  { value: "filled", label: "Filled" },
  { value: "with_icon", label: "With Icon" },
];

// Centralized constants for all molecule property configurations
// These configurations can be used for validation and UI generation
export const MOLECULE_PROPERTIES = {
  molecule_section_header: {
    properties: {
      stack: {
        options: ["vertical", "horizontal"],
        default: "vertical",
        description: "Stack the title and view more button vertically or horizontally",
      },
      variant: {
        options: ["1"],
      },
      sub_variant: {
        options: ["left", "center", "right"],
        default: "left",
        description: "Align the title and view more button to the left, center, or right",
      },
      group1_count: {
        type: "number",
        required: false,
        description: "Number of items in the first group",
      },
    }
  },
  molecule_footer_action: {
    properties: {
      stack: {
        options: ["vertical", "horizontal"],
        default: "vertical",
        description: "Stack the title and view more button vertically or horizontally",
      },
      variant: {
        options: ["1"],
      },
      sub_variant: {
        options: ["left", "center", "right"],
        default: "left",
        description: "Align the title and view more button to the left, center, or right",
      },
      group1_count: {
        type: "number",
        required: false,
        description: "Number of items in the first group",
      },
    }
  },
  molecule_article_extension: {
    properties: {
      stack: {
        options: ["vertical", "horizontal"],
        default: "vertical",
        description: "Stack the title and view more button vertically or horizontally",
      },
      variant: {
        options: ["1"],
      },
      sub_variant: {
        options: ["left", "center", "right"],
        default: "left",
        description: "Align the title and view more button to the left, center, or right",
      },
      group1_count: {
        type: "number",
        required: false,
        description: "Number of items in the first group",
      },
    }
  },
  molecule_article_thumbnail: {
    properties: {
      variant: {
        options: ["1"],
      },
      sub_variant: {
        options: ["video", "image"],
        default: "video",
        description: "Select the type of thumbnail to display",
      },
      play: {
        type: "boolean",
        required: false,
        description: "Show the play button",
      },
    }
  },
  molecule_article_description: {
    properties: {
      stack: {
        options: ["vertical", "horizontal"],
        default: "vertical",
        description: "Stack the title and view more button vertically or horizontally",
      },
      variant: {
        options: ["1"],
      },
      sub_variant: {
        options: ["left", "center", "right"],
        default: "left",
        description: "Align the title and view more button to the left, center, or right",
      },
    }
  },
  molecule_fixturecard_matchinfo: {
    properties: {
      stack: {
        options: ["vertical", "horizontal"],
        default: "vertical",
        description: "Stack the title and view more button vertically or horizontally",
      },
      variant: {
        options: ["1"],
      },
      sub_variant: {
        options: ["left", "center", "right"],
        default: "left",
        description: "Align the title and view more button to the left, center, or right",
      },
    }
  },
  molecule_fixturecard_meta_extension: {
    properties: {
      stack: {
        options: ["vertical", "horizontal"],
        default: "vertical",
        description: "Stack the title and view more button vertically or horizontally",
      },
      variant: {
        options: ["1"],
      },
      sub_variant: {
        options: ["left", "center", "right"],
        default: "left",
        description: "Align the title and view more button to the left, center, or right",
      },
      group1_count: {
        type: "number",
        required: false,
        description: "Number of items in the first group",
      },
    }
  },
  molecule_fixturecard_scores_cricket: {
    properties: {
      stack: {
        options: ["vertical", "horizontal"],
        default: "vertical",
        description: "Stack the title and view more button vertically or horizontally",
      },
      variant: {
        options: ["1"],
      },
      sub_variant: {
        options: ["left", "center", "right"],
        default: "left",
        description: "Align the title and view more button to the left, center, or right",
      },
    }
  },
  molecule_fixturecard_action_extension: {
    properties: {
      stack: {
        options: ["vertical", "horizontal"],
        default: "vertical",
        description: "Stack the title and view more button vertically or horizontally",
      },
      variant: {
        options: ["1"],
      },
      sub_variant: {
        options: ["left", "center", "right"],
        default: "left",
        description: "Align the title and view more button to the left, center, or right",
      },
      group1_count: {
        type: "number",
        required: false,
        description: "Number of items in the first group",
      },
    }
  },
  molecule_fixture_meta_data: {
    properties: {
      stack: {
        options: ["vertical", "horizontal"],
        default: "vertical",
        description: "Stack the title and view more button vertically or horizontally",
      },
      variant: {
        options: ["1"],
      },
      sub_variant: {
        options: ["left", "center", "right"],
        default: "left",
        description: "Align the title and view more button to the left, center, or right",
      },
    }
  },
  molecule_player_extension: {
    properties: {
      stack: {
        options: ["vertical", "horizontal"],
        default: "vertical",
        description: "Stack the title and view more button vertically or horizontally",
      },
      variant: {
        options: ["1"],
      },
      sub_variant: {
        options: ["left", "center", "right"],
        default: "left",
        description: "Align the title and view more button to the left, center, or right",
      },
      group1_count: {
        type: "number",
        required: false,
        description: "Number of items in the first group",
      },
    }
  },
  molecule_player_thumbnail: {
    properties: {
      variant: {
        options: ["1"],
      },
      sub_variant: {
        options: ["left", "center", "right"],
        default: "left",
        description: "Align the title and view more button to the left, center, or right",
      },
    }
  }
};

export const MOLECULE_DUMMY_DATA = {
  molecule_section_header: {
    title: "Section Title",
    sub_title: "Sub Title",
    cta: {
        view_more: [
          {
            type: "link",
            label: "View More",
            url: "https://www.google.com",
          },
        ],
      },
    },
    molecule_footer_action: {
      title: "Section Title",
      cta: {
        view_more: [
          {
            type: "link",
            label: "View More",
            url: "https://www.google.com",
          },
        ],
      },
    },
    molecule_article_extension: {
      asset_id: 1,
      title:
        "Rajasthan Royals' Lead Owner Manoj Badale reacts post the IPL 2025 Auction",
      desc: "The franchise secured the services of 14 players at the IPL auction after spending ₹40.7 crores.",
      url: "https://stg-rr.sportz.io/latest-news/wanindu-hasaranga-joins-rajasthan-royals-ipl",
      thumbnail_image:
        "https://stg-rr.sportz.io/static-assets/waf-images/d1/e8/36/16-9/22AgrUQCdl.png?v=1.40&w=1920",
      created_date: "2008-04-19T15:00+00:00",
      published_date: "2008-04-19T15:00+00:00",
      author: "Naman Agarwal",
      authorUrl: "hellow",
      views: "qwerty",
      entities: {
        primary: {
          name: "News",
          canonical: "https://stg-rr.sportz.io/news",
          is_linkable: true,
        },
        secondary: {
          name: "Rohit Sharma",
          canonical: "https://stg-rr.sportz.io/player/rohit-sharma-1234",
          is_linkable: true,
        },
      },
    },
    molecule_article_thumbnail: {
      asset_id: 1,
      title:
        "Rajasthan Royals' Lead Owner Manoj Badale reacts post the IPL 2025 Auction",
      desc: "The franchise secured the services of 14 players at the IPL auction after spending ₹40.7 crores.",
      url: "https://stg-rr.sportz.io/latest-news/wanindu-hasaranga-joins-rajasthan-royals-ipl",
      thumbnail_image:
        "https://stg-rr.sportz.io/static-assets/waf-images/d1/e8/36/16-9/22AgrUQCdl.png?v=1.40&w=1920",
      created_date: "2008-04-19T15:00+00:00",
      published_date: "2008-04-19T15:00+00:00",
      author: "Naman Agarwal",
      authorUrl: "hellow",
      views: "qwerty",
      entities: {
        primary: {
          name: "News",
          canonical: "https://stg-rr.sportz.io/news",
          is_linkable: true,
        },
        secondary: {
          name: "Rohit Sharma",
          canonical: "https://stg-rr.sportz.io/player/rohit-sharma-1234",
          is_linkable: true,
        },
      },
    },
    molecule_article_description: {
      asset_id: 1,
      title:
        "Rajasthan Royals' Lead Owner Manoj Badale reacts post the IPL 2025 Auction",
      desc: "The franchise secured the services of 14 players at the IPL auction after spending ₹40.7 crores.",
      url: "https://stg-rr.sportz.io/latest-news/wanindu-hasaranga-joins-rajasthan-royals-ipl",
      thumbnail_image:
        "https://stg-rr.sportz.io/static-assets/waf-images/d1/e8/36/16-9/22AgrUQCdl.png?v=1.40&w=1920",
      created_date: "2008-04-19T15:00+00:00",
      published_date: "2008-04-19T15:00+00:00",
      author: "Naman Agarwal",
      authorUrl: "hellow",
      views: "qwerty",
      entities: {
        primary: {
          name: "News",
          canonical: "https://stg-rr.sportz.io/news",
          is_linkable: true,
        },
        secondary: {
          name: "Rohit Sharma",
          canonical: "https://stg-rr.sportz.io/player/rohit-sharma-1234",
          is_linkable: true,
        },
      },
    },
    molecule_fixturecard_matchinfo: {
      event_duration_left: "",
      championship_name: "",
      series_start_date: "2023-06-03",
      participants: [
        {
          name: "Bulgaria",
          name_eng: "Bulgaria",
          short_name: "BUL",
          short_name_eng: "BUL",
          id: "1859",
          value: "159/7 (20.0)",
          now: true,
          players_involved: [],
          logo: "https://staging.wisden.com/static-assets/images/teams/3187.png?v=30.5512345",
        },
        {
          name: "Greece",
          name_eng: "Greece",
          short_name: "GRE",
          short_name_eng: "GRE",
          id: "1816",
          value: "159/4 (20.0)",
          highlight: true,
          firstup: true,
          players_involved: [],
          logo: "https://staging.wisden.com/static-assets/images/teams/3187.png?v=30.5512345",
        },
      ],
      venue_gmt_offset: "+03:00",
      event_coverage_level: "Live Scorecard",
      winning_margin: "16 runs",
      venue_name: "National Sports Academy Vasil Levski, Sofia",
      event_group: "",
      series_name: "ECI Bulgaria, 2023",
      tour_name: "ECI Bulgaria, 2023",
      event_name: "Match 1",
      event_session: "",
      sport: "cricket",
      event_thisover: "0,1,1,0,1,4b",
      parent_series_name: "",
      start_date: "2025-06-03T11:15+05:30",
      event_format: "t10",
      event_stage: "series",
      league_id: "33",
      parent_series_id: "",
      championship_id: "",
      comp_type_id: "7",
      event_is_daynight: "false",
      event_state: "R",
      result_code: "W",
      event_islinkable: "true",
      event_coverage_level_id: "6",
      event_priority: "",
      event_day: "",
      league_code: "venue_scoring",
      game_id: "buggre06032023226921",
      tour_id: "4124",
      end_date: "2023-06-03T13:15+05:30",
      event_status: "Match Ended",
      series_id: "5497",
      event_status_id: "114",
      result_sub_code: "",
      series_end_date: "2023-06-04",
      venue_id: "2116",
      event_livecoverage: "true",
      event_sub_status: "Greece beat Bulgaria by 16 runs",
      event_interval: "2",
      has_standings: "true",
      display_status: "Recent",
      matchcenter_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      highlights_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      tickets_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      add_to_calendar_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
    },
    molecule_fixturecard_meta_extension: {
      event_duration_left: "",
      championship_name: "",
      series_start_date: "2023-06-03",
      participants: [
        {
          name: "Bulgaria",
          name_eng: "Bulgaria",
          short_name: "BUL",
          short_name_eng: "BUL",
          id: "1859",
          value: "159/7 (20.0)",
          now: true,
          players_involved: [],
          logo: "https://staging.wisden.com/static-assets/images/teams/3187.png?v=30.5512345",
        },
        {
          name: "Greece",
          name_eng: "Greece",
          short_name: "GRE",
          short_name_eng: "GRE",
          id: "1816",
          value: "159/4 (20.0)",
          highlight: true,
          firstup: true,
          players_involved: [],
          logo: "https://staging.wisden.com/static-assets/images/teams/3187.png?v=30.5512345",
        },
      ],
      venue_gmt_offset: "+03:00",
      event_coverage_level: "Live Scorecard",
      winning_margin: "16 runs",
      venue_name: "National Sports Academy Vasil Levski, Sofia",
      event_group: "",
      series_name: "ECI Bulgaria, 2023",
      tour_name: "ECI Bulgaria, 2023",
      event_name: "Match 1",
      event_session: "",
      sport: "cricket",
      event_thisover: "0,1,1,0,1,4b",
      parent_series_name: "",
      start_date: "2025-06-03T11:15+05:30",
      event_format: "t10",
      event_stage: "series",
      league_id: "33",
      parent_series_id: "",
      championship_id: "",
      comp_type_id: "7",
      event_is_daynight: "false",
      event_state: "R",
      result_code: "W",
      event_islinkable: "true",
      event_coverage_level_id: "6",
      event_priority: "",
      event_day: "",
      league_code: "venue_scoring",
      game_id: "buggre06032023226921",
      tour_id: "4124",
      end_date: "2023-06-03T13:15+05:30",
      event_status: "Match Ended",
      series_id: "5497",
      event_status_id: "114",
      result_sub_code: "",
      series_end_date: "2023-06-04",
      venue_id: "2116",
      event_livecoverage: "true",
      event_sub_status: "Greece beat Bulgaria by 16 runs",
      event_interval: "2",
      has_standings: "true",
      display_status: "Recent",
      matchcenter_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      highlights_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      tickets_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      add_to_calendar_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
    },
    molecule_fixturecard_scores_cricket: {
      event_duration_left: "",
      championship_name: "",
      series_start_date: "2023-06-03",
      participants: [
        {
          name: "Bulgaria",
          name_eng: "Bulgaria",
          short_name: "BUL",
          short_name_eng: "BUL",
          id: "1859",
          value: "159/7 (20.0)",
          now: true,
          players_involved: [],
          logo: "https://staging.wisden.com/static-assets/images/teams/3187.png?v=30.5512345",
        },
        {
          name: "Greece",
          name_eng: "Greece",
          short_name: "GRE",
          short_name_eng: "GRE",
          id: "1816",
          value: "159/4 (20.0)",
          highlight: true,
          firstup: true,
          players_involved: [],
          logo: "https://staging.wisden.com/static-assets/images/teams/3187.png?v=30.5512345",
        },
      ],
      venue_gmt_offset: "+03:00",
      event_coverage_level: "Live Scorecard",
      winning_margin: "16 runs",
      venue_name: "National Sports Academy Vasil Levski, Sofia",
      event_group: "",
      series_name: "ECI Bulgaria, 2023",
      tour_name: "ECI Bulgaria, 2023",
      event_name: "Match 1",
      event_session: "",
      sport: "cricket",
      event_thisover: "0,1,1,0,1,4b",
      parent_series_name: "",
      start_date: "2025-06-03T11:15+05:30",
      event_format: "t10",
      event_stage: "series",
      league_id: "33",
      parent_series_id: "",
      championship_id: "",
      comp_type_id: "7",
      event_is_daynight: "false",
      event_state: "R",
      result_code: "W",
      event_islinkable: "true",
      event_coverage_level_id: "6",
      event_priority: "",
      event_day: "",
      league_code: "venue_scoring",
      game_id: "buggre06032023226921",
      tour_id: "4124",
      end_date: "2023-06-03T13:15+05:30",
      event_status: "Match Ended",
      series_id: "5497",
      event_status_id: "114",
      result_sub_code: "",
      series_end_date: "2023-06-04",
      venue_id: "2116",
      event_livecoverage: "true",
      event_sub_status: "Greece beat Bulgaria by 16 runs",
      event_interval: "2",
      has_standings: "true",
      display_status: "Recent",
      matchcenter_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      highlights_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      tickets_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      add_to_calendar_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
    },
    molecule_fixturecard_action_extension: {
      event_duration_left: "",
      championship_name: "",
      series_start_date: "2023-06-03",
      participants: [
        {
          name: "Bulgaria",
          name_eng: "Bulgaria",
          short_name: "BUL",
          short_name_eng: "BUL",
          id: "1859",
          value: "159/7 (20.0)",
          now: true,
          players_involved: [],
          logo: "https://staging.wisden.com/static-assets/images/teams/3187.png?v=30.5512345",
        },
        {
          name: "Greece",
          name_eng: "Greece",
          short_name: "GRE",
          short_name_eng: "GRE",
          id: "1816",
          value: "159/4 (20.0)",
          highlight: true,
          firstup: true,
          players_involved: [],
          logo: "https://staging.wisden.com/static-assets/images/teams/3187.png?v=30.5512345",
        },
      ],
      venue_gmt_offset: "+03:00",
      event_coverage_level: "Live Scorecard",
      winning_margin: "16 runs",
      venue_name: "National Sports Academy Vasil Levski, Sofia",
      event_group: "",
      series_name: "ECI Bulgaria, 2023",
      tour_name: "ECI Bulgaria, 2023",
      event_name: "Match 1",
      event_session: "",
      sport: "cricket",
      event_thisover: "0,1,1,0,1,4b",
      parent_series_name: "",
      start_date: "2025-06-03T11:15+05:30",
      event_format: "t10",
      event_stage: "series",
      league_id: "33",
      parent_series_id: "",
      championship_id: "",
      comp_type_id: "7",
      event_is_daynight: "false",
      event_state: "R",
      result_code: "W",
      event_islinkable: "true",
      event_coverage_level_id: "6",
      event_priority: "",
      event_day: "",
      league_code: "venue_scoring",
      game_id: "buggre06032023226921",
      tour_id: "4124",
      end_date: "2023-06-03T13:15+05:30",
      event_status: "Match Ended",
      series_id: "5497",
      event_status_id: "114",
      result_sub_code: "",
      series_end_date: "2023-06-04",
      venue_id: "2116",
      event_livecoverage: "true",
      event_sub_status: "Greece beat Bulgaria by 16 runs",
      event_interval: "2",
      has_standings: "true",
      display_status: "Recent",
      matchcenter_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      highlights_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      tickets_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      add_to_calendar_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
    },
    molecule_fixture_meta_data: {
      event_duration_left: "",
      championship_name: "",
      series_start_date: "2023-06-03",
      participants: [
        {
          name: "Bulgaria",
          name_eng: "Bulgaria",
          short_name: "BUL",
          short_name_eng: "BUL",
          id: "1859",
          value: "159/7 (20.0)",
          now: true,
          players_involved: [],
          logo: "https://staging.wisden.com/static-assets/images/teams/3187.png?v=30.5512345",
        },
        {
          name: "Greece",
          name_eng: "Greece",
          short_name: "GRE",
          short_name_eng: "GRE",
          id: "1816",
          value: "159/4 (20.0)",
          highlight: true,
          firstup: true,
          players_involved: [],
          logo: "https://staging.wisden.com/static-assets/images/teams/3187.png?v=30.5512345",
        },
      ],
      venue_gmt_offset: "+03:00",
      event_coverage_level: "Live Scorecard",
      winning_margin: "16 runs",
      venue_name: "National Sports Academy Vasil Levski, Sofia",
      event_group: "",
      series_name: "ECI Bulgaria, 2023",
      tour_name: "ECI Bulgaria, 2023",
      event_name: "Match 1",
      event_session: "",
      sport: "cricket",
      event_thisover: "0,1,1,0,1,4b",
      parent_series_name: "",
      start_date: "2025-06-03T11:15+05:30",
      event_format: "t10",
      event_stage: "series",
      league_id: "33",
      parent_series_id: "",
      championship_id: "",
      comp_type_id: "7",
      event_is_daynight: "false",
      event_state: "R",
      result_code: "W",
      event_islinkable: "true",
      event_coverage_level_id: "6",
      event_priority: "",
      event_day: "",
      league_code: "venue_scoring",
      game_id: "buggre06032023226921",
      tour_id: "4124",
      end_date: "2023-06-03T13:15+05:30",
      event_status: "Match Ended",
      series_id: "5497",
      event_status_id: "114",
      result_sub_code: "",
      series_end_date: "2023-06-04",
      venue_id: "2116",
      event_livecoverage: "true",
      event_sub_status: "Greece beat Bulgaria by 16 runs",
      event_interval: "2",
      has_standings: "true",
      display_status: "Recent",
      matchcenter_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      highlights_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      tickets_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
      add_to_calendar_url:
        "https://stg-spz.sportz.io/static-assets/wnm-client-config/sdui-store-new/homepage_data.json",
    },
    molecule_player_extension: {
      oversea: true,
      captain: true,
      stats: [
        { text: "Matches", value: 9 },
        { text: "Runs", value: 388 },
        { text: "Wickets", value: 86 },
      ],
      data: { id: "1", name: "Player A", skill: "Batsman" },
      thumbnail_image:
        "https://www.rajasthanroyals.com/static-assets/images/players/74055.png?v=6.73",
      player_name: "Rohit",
      player_surname: "Sharma",
      skill: "BATTER",
    },
    molecule_player_data: {
      oversea: true,
      captain: true,
      stats: [
        { text: "Matches", value: 9 },
        { text: "Runs", value: 388 },
        { text: "Wickets", value: 86 },
      ],
      data: { id: "1", name: "Player A", skill: "Batsman" },
      thumbnail_image:
        "https://www.rajasthanroyals.com/static-assets/images/players/74055.png?v=6.73",
      player_name: "Rohit",
      player_surname: "Sharma",
      skill: "BATTER",
    },
    molecule_player_detail: {
      oversea: true,
      captain: true,
      stats: [
        { text: "Matches", value: 9 },
        { text: "Runs", value: 388 },
        { text: "Wickets", value: 86 },
      ],
      data: { id: "1", name: "Player A", skill: "Batsman" },
      thumbnail_image:
        "https://www.rajasthanroyals.com/static-assets/images/players/74055.png?v=6.73",
      player_name: "Rohit",
      player_surname: "Sharma",
      skill: "BATTER",
    },
    molecule_player_thumbnail: {
      oversea: true,
      captain: true,
      stats: [
        { text: "Matches", value: 9 },
        { text: "Runs", value: 388 },
        { text: "Wickets", value: 86 },
      ],
      data: { id: "1", name: "Player A", skill: "Batsman" },
      thumbnail_image:
        "https://www.rajasthanroyals.com/static-assets/images/players/74055.png?v=6.73",
      player_name: "Rohit",
      player_surname: "Sharma",
      skill: "BATTER",
    },
  }

