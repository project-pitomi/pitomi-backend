import DataLoader from "dataloader";
import Bookmark from "../model/bookmark.mjs";

const bookmarkLoader = (userId) => {
  return new DataLoader(async (galleryIds) => {
    const bookmarks = await Bookmark.find({ galleryId: { $in: galleryIds } });
    const bookmarkDict = bookmarks.reduce((dict, elem) => {
      dict[elem.galleryId] = elem;
      return dict;
    }, {});

    return galleryIds.map((galleryId) => bookmarkDict[galleryId]);
  });
};

export default bookmarkLoader;
