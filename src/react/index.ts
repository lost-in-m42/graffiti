import * as Linking from './Linking'
export { Linking }

export { default as StyleSheet } from './Stylesheet'
export { render } from './reconciler'

export { ActivityIndicator } from './components/ActivityIndicator'
export { ScrollView } from './components/ScrollView'
export { View } from './components/View'
export { Text } from './components/Text'
export { TextInput } from './components/TextInput'
export { TouchableWithoutFeedback } from './components/TouchableWithoutFeedback'

export { Button } from './components/Button'
export { Switch } from './components/Switch'
export { FlatList } from './components/FlatList'
export { Image } from './components/Image'

declare module 'react-native' {
  interface ViewStyle {
    content?: string
    backgroundImageUrl?: string
    shadowSpread?: number
  }

  interface CommonProps {
    // TODO: only els with tabindex should be focusable
    tabindex?: number
    onFocus?: (ev) => void
    onBlur?: (ev) => void
    onKeyDown?: (ev) => void
    onKeyUp?: (ev) => void
    onKeyPress?: (ev) => void
    onClick?: (ev) => void
    onMouseDown?: (ev) => void
    onMouseUp?: (ev) => void
    onMouseMove?: (ev) => void
    onMouseOver?: (ev) => void
    onMouseOut?: (ev) => void
  }

  interface ViewProps extends CommonProps {}

  type TextValue = string | number | null | undefined | false

  interface TextProps extends CommonProps {
    children?: TextValue | TextValue[]
  }
}
