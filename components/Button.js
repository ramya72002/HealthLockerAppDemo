import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';
import { Button } from "galio-framework";

import argonTheme from "../constants/Theme";

class ArButton extends React.Component {
  // Define default props using static fields
  static defaultProps = {
    small: false,
    shadowless: false,
    color: 'default',
    style: {},
  };

  render() {
    const { small, shadowless, children, color, style, ...props } = this.props;

    const colorStyle = color && argonTheme.COLORS[color.toUpperCase()]; // Get the color from the theme

    const buttonStyles = [
      small && styles.smallButton, // Apply small button style if `small` is true
      color && { backgroundColor: colorStyle }, // Apply custom color style
      !shadowless && styles.shadow, // Apply shadow if `shadowless` is false
      { ...style }, // Spread custom styles passed as props
    ];

    return (
      <Button
        style={buttonStyles}
        shadowless
        textStyle={{ fontSize: 12, fontWeight: '700' }}
        {...props} // Spread additional props
      >
        {children}
      </Button>
    );
  }
}

// Define prop types for validation
ArButton.propTypes = {
  small: PropTypes.bool,
  shadowless: PropTypes.bool,
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf(['default', 'primary', 'secondary', 'info', 'error', 'success', 'warning'])
  ]),
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};

const styles = StyleSheet.create({
  smallButton: {
    width: 75,
    height: 28,
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export default ArButton;
