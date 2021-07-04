const context = (blobServiceClient, getBlobSasUri, repository, loader) => {
  return (req) => {
    return {
      ...req.context,
      blobServiceClient: blobServiceClient,
      blobUriGenerator: getBlobSasUri,
      repository,
      loader: loader(req.context.userId),
    };
  };
};

export default context;
