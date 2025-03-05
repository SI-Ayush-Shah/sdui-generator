import {
  ArticleContentV1,
  ArticleExtentionV1,
  ArticleThumbnailV1,
} from "@sikit/article";
import {
  FixtureMatchInfoV1,
  FixtureMetaDataV1,
  FixtureMatchScoreV4,
  FixtureMatchActionV1,
} from "@sikit/cricket-fixtures";
import { PlayersExtentionV1, PlayersContent, PlayerDetail, PlayersThumbnail } from "@sikit/players";
import { SectionName,SectionFooter } from "@sikit/section-name";

export const componentMap = {
  molecule_section_header: SectionName,
  molecule_footer_action: SectionFooter,
  molecule_article_extension: ArticleExtentionV1,
  molecule_article_thumbnail: ArticleThumbnailV1,
  molecule_article_description: ArticleContentV1,
  molecule_fixturecard_matchinfo: FixtureMatchInfoV1,
  molecule_fixturecard_meta_extension: FixtureMetaDataV1,
  molecule_fixturecard_scores_cricket: FixtureMatchScoreV4,
  molecule_fixturecard_action_extension: FixtureMatchActionV1,  
  molecule_fixture_meta_data: FixtureMetaDataV1,            
  molecule_player_extension: PlayersExtentionV1,
  molecule_player_data: PlayersContent,
  molecule_player_detail: PlayerDetail,
  molecule_player_thumbnail: PlayersThumbnail,              
};
