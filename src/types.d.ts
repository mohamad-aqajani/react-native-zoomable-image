import {ImageProps} from 'react-native';

interface AdditionalProps extends ImageProps {
  enablePan?: boolean;
  releaseDuration?: number;
}

export declare type ZoomableImageProps = AdditionalProps;
