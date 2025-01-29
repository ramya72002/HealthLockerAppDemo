import React from 'react';
import { TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Button, Block, NavBar, Text, theme } from 'galio-framework';

import Icon from './Icon';
import Input from './Input';
import Tabs from './Tabs';
import argonTheme from '../constants/Theme';
import { useNavigation } from '@react-navigation/native'; // useNavigation hook

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

const BellButton = ({isWhite, style}) => {
  const navigation = useNavigation(); // useNavigation hook
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
      <Icon
        family="ArgonExtra"
        size={16}
        name="bell"
        color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
      />
      <Block middle style={styles.notify} />
    </TouchableOpacity>
  );
};

const BasketButton = ({isWhite, style}) => {
  const navigation = useNavigation(); // useNavigation hook
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
      <Icon
        family="ArgonExtra"
        size={16}
        name="basket"
        color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
      />
    </TouchableOpacity>
  );
};

const SearchButton = ({isWhite, style}) => {
  const navigation = useNavigation(); // useNavigation hook
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
      <Icon
        size={16}
        family="Galio"
        name="search-zoom-in"
        color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
      />
    </TouchableOpacity>
  );
};

const Header = ({ back, title, white, transparent, bgColor, iconColor, titleColor, optionLeft, optionRight, tabs, tabIndex, search, options }) => {
  const navigation = useNavigation(); // useNavigation hook

  const handleLeftPress = () => {
    return back ? navigation.goBack() : navigation.openDrawer();
  };

  const renderRight = () => {
    if (title === 'Title') {
      return [
        <BellButton key='chat-title' navigation={navigation} isWhite={white} />,
        <BasketButton key='basket-title' navigation={navigation} isWhite={white} />
      ]
    }
    if (title.startsWith('Hi')) {
      return [
        <BellButton key='chat-home' navigation={navigation} isWhite={white} />,
        <BasketButton key='basket-home' navigation={navigation} isWhite={white} />
      ];
    }

    switch (title) {
      case 'Home':
        return [
          <BellButton key='chat-home' navigation={navigation} isWhite={white} />,
          <BasketButton key='basket-home' navigation={navigation} isWhite={white} />
        ];
      case 'Deals':
        return [
          <BellButton key='chat-categories' navigation={navigation} />,
          <BasketButton key='basket-categories' navigation={navigation} />
        ];
      case 'Categories':
        return [
          <BellButton key='chat-categories' navigation={navigation} isWhite={white} />,
          <BasketButton key='basket-categories' navigation={navigation} isWhite={white} />
        ];
      case 'Category':
        return [
          <BellButton key='chat-deals' navigation={navigation} isWhite={white} />,
          <BasketButton key='basket-deals' navigation={navigation} isWhite={white} />
        ];
      case 'Profile':
        return [
          <BellButton key='chat-profile' navigation={navigation} isWhite={white} />,
          <BasketButton key='basket-deals' navigation={navigation} isWhite={white} />
        ];
      case 'Product':
        return [
          <SearchButton key='search-product' navigation={navigation} isWhite={white} />,
          <BasketButton key='basket-product' navigation={navigation} isWhite={white} />
        ];
      case 'Search':
        return [
          <BellButton key='chat-search' navigation={navigation} isWhite={white} />,
          <BasketButton key='basket-search' navigation={navigation} isWhite={white} />
        ];
      case 'Settings':
        return [
          <BellButton key='chat-search' navigation={navigation} isWhite={white} />,
          <BasketButton key='basket-search' navigation={navigation} isWhite={white} />
        ];
      default:
        break;
    }
  };

  const renderSearch = () => {
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        placeholderTextColor={'#8898AA'}
        onFocus={() => navigation.navigate('Pro')}
        iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="search-zoom-in" family="ArgonExtra" />}
      />
    );
  };

  const renderOptions = () => {
    return (
      <Block row style={styles.options}>
      <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('CameraUpload')}>
        <Block row middle >
          <Icon name="diamond" family="ArgonExtra" style={{ paddingRight: 8}} color={argonTheme.COLORS.ICON} />
          <Text size={16} style={styles.tabTitle}>{optionLeft || 'Upload EHR'}</Text>
        </Block>
      </Button>
      <Button shadowless style={styles.tab} onPress={() => navigation.navigate('DisplayRecords')}>
        <Block row middle>
          <Icon size={16} name="bag-17" family="ArgonExtra" style={{ paddingRight: 8 }} color={argonTheme.COLORS.ICON} />
          <Text size={16} style={styles.tabTitle}>{optionRight || 'Get EHR'}</Text>
        </Block>
      </Button>
      <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('SendEHR')}>
        <Block row middle >
          <Icon name="diamond" family="ArgonExtra" style={{ paddingRight: 8}} color={argonTheme.COLORS.ICON} />
          <Text size={16} style={styles.tabTitle}>{optionLeft || 'Send EHR'}</Text>
        </Block>
      </Button>
    </Block>
    );
  };

  const renderTabs = () => {
    const defaultTab = tabs && tabs[0] && tabs[0].id;
    
    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => navigation.setParams({ tabId: id })} />
    );
  };

  const renderHeader = () => {
    if (search || tabs || options) {
      return (
        <Block center>
          {search ? renderSearch() : null}
          {options ? renderOptions() : null}
          {tabs ? renderTabs() : null}
        </Block>
      );
    }
  };

  const noShadow = ['Search', 'Categories', 'Deals', 'Pro', 'Profile'].includes(title);
  const headerStyles = [
    !noShadow ? styles.shadow : null,
    transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
  ];

  const navbarStyles = [
    styles.navbar,
    bgColor && { backgroundColor: bgColor }
  ];

  return (
    <Block style={headerStyles}>
      <NavBar
        back={false}
        title={title}
        style={navbarStyles}
        transparent={transparent}
        right={renderRight()}
        rightStyle={{ alignItems: 'center' }}
        left={
          <Icon 
            name={back ? 'chevron-left' : "menu"} family="entypo" 
            size={20} onPress={handleLeftPress} 
            color={iconColor || (white ? argonTheme.COLORS.WHITE : argonTheme.COLORS.ICON)}
            style={{ marginTop: 2 }}
          />
        }
        leftStyle={{ paddingVertical: 12, flex: 0.2 }}
        titleStyle={[
          styles.title,
          { color: argonTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
          titleColor && { color: titleColor }
        ]}
      />
      {renderHeader()}
    </Block>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative',
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: argonTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 9,
    right: 12,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON,
  },
  search: {
    height: 40,
    width: width - 32,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: argonTheme.COLORS.BORDER
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.3,
    borderRadius: 3,
  },
  tabTitle: {
    color: argonTheme.COLORS.ICON,
    fontSize: 12,
  },
});

export default Header;