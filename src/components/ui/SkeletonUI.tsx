import { Skeleton, SkeletonProps } from "@chakra-ui/react";

type SkeletonUIProps = {
  length?: number;
} & SkeletonProps;

export function SkeletonUI({ length = 1, ...rest }: SkeletonUIProps) {
  return Array.from({ length }).map((_, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Skeleton {...rest} key={index} fadeDuration={0.5} />
  ));
}
