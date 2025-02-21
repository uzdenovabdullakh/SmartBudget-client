import { VStack, Box, Spinner, Text } from "@chakra-ui/react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useEffect, useRef, useState } from "react";
import { useGetCheckByQrMutation } from "@/lib/services/check.api";

type Props = {
  onScanComplete: (data: any) => void;
};

export const ScanTransaction = ({ onScanComplete }: Props) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [checkData, setCheckData] = useState<any>(null);
  const [getCheckByQr, { isLoading }] = useGetCheckByQrMutation();

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
        <Scanner
          onScan={handleScan}
          onError={(error: any) => setScanError(error.message)}
        />
      )}
    </VStack>
  );
};
