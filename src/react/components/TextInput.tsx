import * as React from 'react'
import { useState, useCallback } from 'react'
import { TextInputProps } from '../react-native-types'
import View from './View';
import { Text } from './Text';
import StyleSheet from '../Stylesheet';

const TextInput = (props: TextInputProps) => {
  const [active, setActive] = useState(false)
  const textInput = useTextValue(props.value, props.onChangeText)

  return (
    <View style={[styles.input, active && styles.active, props.style]} {...textInput} onFocus={() => setActive(true)} onBlur={() => setActive(false)}>
      <Text style={styles.text}>{props.value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 12,
    borderColor: '#cccccc',
    borderRadius: 4,
    borderWidth: 1
  },

  active: {
    borderColor: '#8888ee'
  },

  text: {
    lineHeight: 38,
    color: '#666666'
  }
})

export default TextInput

// this is very basic for now
export const useTextValue = (value, onChange) => {
  const onKeyPress = useCallback((e) => {
      // backspace
      if (e.key === '\u007f') {
        // TODO: caret position
        return onChange(value.slice(0, -1))
      }

      if ( ! e.key) {
        return
      }

      onChange(value + e.key)
  }, [value])

  return {
    value,
    onKeyPress
  }
}
