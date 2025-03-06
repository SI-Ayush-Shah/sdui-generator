/**
 * Standard structure definitions for molecules
 *
 * This file defines the expected atoms for each molecule type with their
 * standard naming conventions and atom types. This helps maintain consistency
 * and makes it easier to connect atoms to molecules.
 */

// Define atom types for easier reference
export const ATOM_TYPES = {
  TEXT: "text",
  BADGE: "badge",
  BUTTON: "button",
  IMAGE: "img",
  ICON: "icon",
  BOX: "box",
  LOGO: "logo",
};

/**
 * Standard atom structure for each molecule type
 *
 * Format:
 * {
 *   moleculeName: {
 *     atom_name: {
 *       type: 'atom_type',
 *       required: true/false,
 *       description: 'Description of the atom's purpose'
 *     }
 *   }
 * }
 */
export const MOLECULE_STRUCTURES = {
  // Article Related Molecules
  molecule_article_thumbnail: {
    thumbnail: {
      type: ATOM_TYPES.IMAGE,
      required: true,
      description: "Main thumbnail image",
    },
    badge: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Category or status badge",
    },
  },

  molecule_article_extension: {
    atom_primary_category: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Primary category badge",
    },
    atom_secondary_category: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Secondary category badge",
    },
    atom_date: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Publication date badge",
    },
    atom_timestamp: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Timestamp badge",
    },
    atom_author: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Author badge",
    },
    atom_status: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Status badge",
    },
    atom_duration: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Reading duration badge",
    },
    atom_read_more: {
      type: ATOM_TYPES.BUTTON,
      required: false,
      description: "Read more button",
    },
    atom_like: {
      type: ATOM_TYPES.BUTTON,
      required: false,
      description: "Like button",
    },
    atom_share: {
      type: ATOM_TYPES.BUTTON,
      required: false,
      description: "Share button",
    },
    atom_views: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Views count badge",
    },
    atom_bookmark: {
      type: ATOM_TYPES.BUTTON,
      required: false,
      description: "Bookmark button",
    },
    atom_comment: {
      type: ATOM_TYPES.BUTTON,
      required: false,
      description: "Comment button",
    },
    atom_view_details: {
      type: ATOM_TYPES.BUTTON,
      required: false,
      description: "View details button",
    },
  },

  molecule_article_description: {
    title: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Article title",
    },
    description: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Article description or excerpt",
    },
  },

  // Badge Pair
  molecule_badge_pair: {
    atom_badge_1: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "First badge",
    },
    atom_badge_2: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Second badge",
    },
  },

  // Image Text Combo
  molecule_image_text_combo: {
    atom_logo: {
      type: ATOM_TYPES.LOGO,
      required: false,
      description: "Logo image",
    },
    atom_text_title: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Title text",
    },
  },

  // Text Pair
  molecule_text_pair: {
    atom_text_title: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Title text",
    },
    atom_text_data: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Data or content text",
    },
  },

  // Player Related Molecules
  molecule_player_data: {
    atom_title: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Player title",
    },
    atom_data: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Player data/stats",
    },
  },

  molecule_player_detail: {
    thumbnail: {
      type: ATOM_TYPES.IMAGE,
      required: true,
      description: "Player image",
    },
    atom_player_name: {
      type: ATOM_TYPES.TEXT,
      required: true,
      description: "Player name",
    },
    atom_player_surname: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Player surname",
    },
    atom_skill: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Player skill badge",
    },
  },

  molecule_player_extension: {
    atom_captain: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Captain status badge",
    },
    atom_oversea: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Overseas player badge",
    },
  },

  molecule_player_thumbnail: {
    thumbnail: {
      type: ATOM_TYPES.IMAGE,
      required: true,
      description: "Player thumbnail image",
    },
    atom_player_name: {
      type: ATOM_TYPES.TEXT,
      required: true,
      description: "Player name",
    },
  },

  // Section Related Molecules
  molecule_section_header: {
    atom_title: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Main section title",
    },
    atom_section_title_small: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Secondary/smaller section title",
    },
    button_view_more: {
      type: ATOM_TYPES.BUTTON,
      required: false,
      description: "View more button",
    },
  },

  molecule_footer_action: {
    button_view_more: {
      type: ATOM_TYPES.BUTTON,
      required: false,
      description: "View more button",
    },
  },

  // Fixture Related Molecules
  molecule_fixturecard_action_extension: {
    atom_match_center: {
      type: ATOM_TYPES.BUTTON,
      required: false,
      description: "Match center button",
    },
    atom_highlightss: {
      type: ATOM_TYPES.BUTTON,
      required: false,
      description: "Highlights button",
    },
    atom_calendar: {
      type: ATOM_TYPES.BUTTON,
      required: false,
      description: "Calendar button",
    },
    atom_buy_tickets: {
      type: ATOM_TYPES.BUTTON,
      required: false,
      description: "Buy tickets button",
    },
  },

  molecule_fixturecard_matchinfo: {
    atom_venue: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Venue text",
    },
    atom_match_update: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Match update text",
    },
    atom_venue_icon: {
      type: ATOM_TYPES.ICON,
      required: false,
      description: "Venue icon",
    },
    atom_match_update_icon: {
      type: ATOM_TYPES.ICON,
      required: false,
      description: "Match update icon",
    },
  },

  molecule_fixturecard_scores_cricket: {
    atom_team_score: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Team score text",
    },
    atom_team_name: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Team name text",
    },
    atom_versus: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Versus badge",
    },
    atom_team_logo: {
      type: ATOM_TYPES.IMAGE,
      required: false,
      description: "Team logo image",
    },
    atom_team_box_props: {
      type: ATOM_TYPES.BOX,
      required: false,
      description: "Team box container",
    },
    atom_team_overs: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Team overs text",
    },
    atom_yet_to_bat: {
      type: ATOM_TYPES.TEXT,
      required: false,
      description: "Yet to bat text",
    },
  },

  molecule_fixturecard_meta_extension: {
    atom_tournament: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Tournament badge",
    },
    atom_match: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Match information badge",
    },
    atom_date: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Date badge",
    },
    atom_time: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Time badge",
    },
    atom_status_live: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Live status badge",
    },
    atom_status_recent: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Recent status badge",
    },
    atom_status_upcoming: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Upcoming status badge",
    },
  },

  // Alias for FixtureMetaData
  molecule_fixture_meta_data: {
    atom_tournament: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Tournament badge",
    },
    atom_match: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Match information badge",
    },
    atom_date: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Date badge",
    },
    atom_time: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Time badge",
    },
    atom_status_live: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Live status badge",
    },
    atom_status_recent: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Recent status badge",
    },
    atom_status_upcoming: {
      type: ATOM_TYPES.BADGE,
      required: false,
      description: "Upcoming status badge",
    },
  },
};

/**
 * Get atom structure for a specific molecule type
 * @param {string} moleculeType - The type of molecule
 * @returns {Object|null} - The atom structure or null if not found
 */
export const getAtomStructureForMolecule = (moleculeType) => {
  return MOLECULE_STRUCTURES[moleculeType] || null;
};

/**
 * Get suggested atom names as options for a specific molecule type
 * @param {string} moleculeType - The type of molecule
 * @returns {Array} - Array of suggested atom name options
 */
export const getAtomOptionsForMolecule = (moleculeType) => {
  const structure = MOLECULE_STRUCTURES[moleculeType];
  if (!structure) return [];

  return Object.entries(structure).map(([atomName, config]) => ({
    value: atomName,
    label: atomName,
    description: config.description,
    type: config.type,
    required: config.required,
  }));
};

/**
 * Check if an atom name is valid for a specific molecule type
 * @param {string} moleculeType - The type of molecule
 * @param {string} atomName - The atom name to check
 * @returns {boolean} - Whether the atom name is valid
 */
export const isValidAtomNameForMolecule = (moleculeType, atomName) => {
  const structure = MOLECULE_STRUCTURES[moleculeType];
  return structure ? !!structure[atomName] : true;
};
