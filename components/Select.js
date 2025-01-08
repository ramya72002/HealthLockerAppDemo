import React from 'react';
import { StyleSheet, Picker } from 'react-native';
import PropTypes from 'prop-types';
import { Block, Text } from 'galio-framework';

import Icon from './Icon';
import { argonTheme } from '../constants';

class DropDown extends React.Component {
  state = {
    value: 1,
  }

  handleOnValueChange = (value) => {
    const { onSelect } = this.props;

    this.setState({ value: value });
    onSelect && onSelect(value);
  }

  render() {
    const { onSelect, iconName, iconFamily, iconSize, iconColor, color, textStyle, style, options, ...props } = this.props;

    const pickerStyles = [
      styles.qty,
      color && { backgroundColor: color },
      style
    ];

    const textStyles = [
      styles.text,
      textStyle
    ];

    return (
      <Block flex row middle style={pickerStyles}>
        <Text size={12} style={textStyles}>{this.state.value}</Text>
        <Picker
          selectedValue={this.state.value}
          style={{ height: 50, width: 150, opacity: 0 }}
          onValueChange={this.handleOnValueChange}
          {...props}
        >
          {options.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
        <Icon name={iconName || "nav-down"} family={iconFamily || "ArgonExtra"} size={iconSize || 10} color={iconColor || argonTheme.COLORS.WHITE} />
      </Block>
    )
  }
}

DropDown.propTypes = {
  onSelect: PropTypes.func,
  iconName: PropTypes.string,
  iconFamily: PropTypes.string,
  iconSize: PropTypes.number,
  color: PropTypes.string,
  textStyle: PropTypes.any,
  options: PropTypes.array, // Array of options to be displayed in the dropdown
};

const styles = StyleSheet.create({
  qty: {
    width: 100,
    backgroundColor: argonTheme.COLORS.DEFAULT,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 9.5,
    borderRadius: 4,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  text: {
    color: argonTheme.COLORS.WHITE,
    fontWeight: '600',
  },
});

export default DropDown;
