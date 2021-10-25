import React, {useRef} from 'react';
import {Image, Dimensions, ImageStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerEventPayload,
  GestureEventPayload,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {ZoomableImageProps} from './types';

const {width, height} = Dimensions.get('window');

const AnimatedImageComponent = Animated.createAnimatedComponent(Image);

const ZoomableImage: React.FC<ZoomableImageProps> = ({
  style,
  source,
  enablePan,
  releaseDuration,
  ...props
}) => {
  const pinchRef = useRef(),
    panRef = useRef();

  //Animation values
  const translateX = useSharedValue(1),
    translateY = useSharedValue(1),
    scale = useSharedValue(1),
    focalX = useSharedValue(0),
    focalY = useSharedValue(0);

  const pinchGestureHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onActive: (
        event: PinchGestureHandlerEventPayload & GestureEventPayload,
      ) => {
        scale.value = event.scale;
        focalX.value = event.focalX;
        focalY.value = event.focalY;
      },
      onEnd: () => {
        scale.value = withTiming(1, {duration: releaseDuration || 300});
      },
    });

  const panGestureHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
      {
        onActive: (
          event: PanGestureHandlerEventPayload & GestureEventPayload,
        ) => {
          translateX.value = !enablePan ? translateX.value : event.translationX;
          translateY.value = !enablePan ? translateY.value : event.translationY;
        },
        onEnd: () => {
          translateX.value = withTiming(1);
          translateY.value = withTiming(1);
        },
      },
      [],
    );

  const AnimatedStyle = useAnimatedStyle<ImageStyle>(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {translateX: focalX.value},
        {translateY: focalY.value},
        {translateX: -width / 2},
        {translateY: -height / 2},
        {scale: scale.value},
        {translateX: -focalX.value},
        {translateY: -focalY.value},
        {translateX: width / 2},
        {translateY: height / 2},
      ],
    };
  }, []);

  return (
    <PanGestureHandler
      simultaneousHandlers={pinchRef}
      minPointers={2}
      ref={panRef}
      onGestureEvent={panGestureHandler}>
      <Animated.View>
        <PinchGestureHandler
          minPointers={2}
          simultaneousHandlers={panRef}
          ref={pinchRef}
          onGestureEvent={pinchGestureHandler}>
          <Animated.View>
            <AnimatedImageComponent
              {...props}
              style={[style, AnimatedStyle]}
              source={source}
            />
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};
ZoomableImage.defaultProps = {
  enablePan: true,
};

export default ZoomableImage;
