import { VStack, Box, Spinner, Text, Input, Button } from "@chakra-ui/react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useEffect, useRef, useState } from "react";
import {
  useGetCheckByQrMutation,
  useUploadCheckByFileMutation,
} from "@/lib/services/check.api";
import { useTranslation } from "react-i18next";

type Props = {
  onScanComplete: (data: any) => void;
};

export const ScanTransaction = ({ onScanComplete }: Props) => {
  const { t } = useTranslation();

  const boxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [scanError, setScanError] = useState<string | null>(null);
  const [checkData, setCheckData] = useState<any>(null);
  const [getCheckByQr, { isLoading }] = useGetCheckByQrMutation();
  const [uploadCheckByFile, { isLoading: isUploading }] =
    useUploadCheckByFileMutation();

  const handleParseCheck = (data: any) => {
    const transactionData = {
      date: data.dateTime,
      outflow: data.totalSum / 100,
      description: data.retailPlace ?? data.user,
    };
    onScanComplete(transactionData);
  };

  const handleScan = async (data: IDetectedBarcode[]) => {
    if (data.length) {
      const qrraw = data[0].rawValue;
      try {
        const result = await getCheckByQr(qrraw).unwrap();
        setCheckData(result);

        handleParseCheck(result.data.json);
      } catch (error: any) {
        setScanError(error.message);
      }
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await uploadCheckByFile(file).unwrap();
        setCheckData(result);
        handleParseCheck(result.data.json);
      } catch (error: any) {
        setScanError(error.message);
      }
    }
  };

  useEffect(() => {
    if (checkData && boxRef.current) {
      const images = boxRef.current.querySelectorAll("img");
      images.forEach((img) => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("http")) {
          img.setAttribute("src", `https://proverkacheka.com${src}`);
        }
      });
    }
  }, [checkData]);

  return (
    <VStack spacing={5} minH="470px">
      {isLoading && <Spinner />}
      {scanError && <Text color="red.500">{scanError}</Text>}
      {checkData ? (
        <Box
          ref={boxRef}
          width="full"
          p={4}
          borderWidth="1px"
          borderRadius="md"
          dangerouslySetInnerHTML={{ __html: checkData.data.html }}
        />
      ) : (
        <VStack justifyContent="space-between" spacing={5}>
          <Scanner
            onScan={handleScan}
            onError={(error: any) => setScanError(error.message)}
            styles={{
              container: {
                width: "85%",
                height: "85%",
              },
            }}
          />
          <Box>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              display="none"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              isLoading={isUploading}
            >
              {t("Upload File Instead")}
            </Button>
          </Box>
        </VStack>
      )}
    </VStack>
  );
};
