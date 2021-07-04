import express from "express";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";
import cors from "cors";

import Context from "./context/index.mjs";
import schema from "./schema/index.mjs";
import authentication from "./middleware/authentication.mjs";
import { BlobServiceClient, GetBlobSasUri } from "./storage.mjs";
import BookmarkLoader from "./dataloader/bookmarkLoader.mjs";
import Artist from "./model/artist.mjs";
import Authorization from "./model/authorization.mjs";
import Bookmark from "./model/bookmark.mjs";
import Count from "./model/count.mjs";
import Gallery from "./model/gallery.mjs";
import Group from "./model/group.mjs";
import Series from "./model/series.mjs";
import Tag from "./model/tag.mjs";
import Type from "./model/type.mjs";
import User from "./model/user.mjs";
import { createUser } from "./util.mjs";

const env = {
  username: process.env.PITOMI_USERNAME,
  password: process.env.PITOMI_PASSWORD,
  mongoDBConnectionString: process.env.PITOMI_MONGO_CONNECTION_STRING,
  azureStorageAccountEndpoint:
    process.env.PITOMI_AZURE_STORAGE_ACCOUNT_ENDPOINT,
  azureStorageAccountAccount: process.env.PITOMI_AZURE_STORAGE_ACCOUNT_ACCOUNT,
  azureStorageAccountAccountKey:
    process.env.PITOMI_AZURE_STORAGE_ACCOUNT_ACCOUNT_KEY,
  azureStorageAccountSASToken:
    process.env.PITOMI_AZURE_STORAGE_ACCOUNT_SAS_TOKEN,
  secret: process.env.PITOMI_SECRET,
};

const blobServiceClient = BlobServiceClient(
  env.azureStorageAccountEndpoint,
  env.azureStorageAccountAccount,
  env.azureStorageAccountAccountKey
);
const getBlobSasUri = GetBlobSasUri(env.azureStorageAccountSASToken);
const repository = {
  Artist,
  Authorization: Authorization(env.secret),
  Bookmark,
  Count,
  Gallery,
  Group,
  Series,
  Tag,
  Type,
  User,
};
const loader = (userId) => ({
  Bookmark: BookmarkLoader(userId),
});

createUser(User, env.username, env.password);

const app = express();
const context = Context(blobServiceClient, getBlobSasUri, repository, loader);

app.use(authentication(repository.Authorization, env.secret));
app.use(
  "/graphql",
  cors(),
  graphqlHTTP((req) => ({
    context: context(req),
    schema,
    graphiql: { headerEditorEnabled: true },
  }))
);

await mongoose.connect(
  //"mongodb://myhan:aG1CNladJPmBOtcKxPDwK1GijLdWLi7291iagI30hrnHzz16qPde1O5TVtvaQGoI7fK6MBRoMQDBBGEWXowo7g%3D%3D@myhan.mongo.cosmos.azure.com:10255/hitomi?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@myhan@",
  env.mongoDBConnectionString,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.listen(4000);
