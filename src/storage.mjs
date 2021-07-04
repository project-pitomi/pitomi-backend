import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

const blobServiceClient = (
  azureStorageAccountEndpoint,
  azureStorageAccountAccount,
  azureStorageAccountAccountKey
) =>
  new BlobServiceClient(
    azureStorageAccountEndpoint,
    new StorageSharedKeyCredential(
      azureStorageAccountAccount,
      azureStorageAccountAccountKey
    )
  );

const getBlobSasUri =
  (azureStorageAccountSASToken) =>
  (blobServiceClient, containerName, blobName) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    return `${
      containerClient.getBlockBlobClient(blobName).url
    }${azureStorageAccountSASToken}`;
  };

export {
  blobServiceClient as BlobServiceClient,
  getBlobSasUri as GetBlobSasUri,
};
