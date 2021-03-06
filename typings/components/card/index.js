import React from "react";
import { StyleSheet } from "react-native";
import _ from "lodash";
import { Colors, BorderRadiuses } from "../../style";
import { BaseComponent } from "../../commons";
import View from "../view";
import TouchableOpacity from "../touchableOpacity";
import MultipleShadow from "../MultipleShadow";
import CardSection from "./CardSection";
import CardItem from "./CardItem";
import CardImage from "./CardImage";
/**
 * @description: Card component
 * @extends: TouchableOpacity
 * @extendsnotes: (when passing onPress)
 * @extendslink: docs/TouchableOpacity
 * @modifiers: margin, padding
 * @gif: https://media.giphy.com/media/l0HU9SKWmv0VTOYMM/giphy.gif
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/CardsScreen.js
 */
class Card extends BaseComponent {
    generateStyles() {
        this.styles = createStyles(this.props);
    }
    // todo: add unit test
    calcImagePosition(childIndex) {
        const { row, children } = this.props;
        const childrenCount = React.Children.count(children);
        const position = [];
        if (childIndex === 0) {
            position.push(row ? "left" : "top");
        }
        if (childIndex === childrenCount - 1) {
            position.push(row ? "right" : "bottom");
        }
        return position;
    }
    get elevationStyle() {
        const { elevation, enableShadow } = this.getThemeProps();
        if (enableShadow) {
            return { elevation: elevation || 2 };
        }
    }
    renderChildren() {
        const { borderRadius } = this.props;
        const children = React.Children.map(this.props.children, (child, index) => {
            if (_.get(child, "type") === CardImage) {
                const position = this.calcImagePosition(index);
                return React.cloneElement(child, {
                    key: index,
                    position,
                    borderRadius
                });
            }
            return child;
        });
        return children;
    }
    render() {
        const { row, width, height, onPress, style, containerStyle, enableShadow, borderRadius, testID, ...others } = this.getThemeProps();
        const multipleShadowProps = MultipleShadow.extractOwnProps(this.props);
        const Container = onPress ? TouchableOpacity : View;
        const ShadowContainer = enableShadow ? MultipleShadow : View;
        return (<Container style={[
            this.styles.container,
            { borderRadius },
            this.elevationStyle,
            containerStyle
        ]} onPress={onPress} delayPressIn={10} activeOpacity={0.6} testID={testID} {...others}>
        <ShadowContainer {...multipleShadowProps} style={{ borderRadius }}>
          <View width={width} height={height} row={row} style={[this.styles.innerContainer, { borderRadius }, style]}>
            {this.renderChildren()}
          </View>
        </ShadowContainer>
      </Container>);
    }
}
Card.displayName = "Card";
Card.defaultProps = {
    borderRadius: BorderRadiuses.br40,
    enableShadow: true
};
function createStyles({ width, height, enableShadow }) {
    // const borderRadius = BorderRadiuses.br40;
    return StyleSheet.create({
        container: {
            width,
            height,
            // backgroundColor: Constants.isIOS ? 'transparent' : Colors.white,
            overflow: "visible",
            // borderRadius,
            elevation: enableShadow ? 2 : 0
        },
        innerContainer: {
            backgroundColor: Colors.white,
            // borderRadius,
            overflow: "hidden",
            flexGrow: 1
        }
    });
}
Card.Section = CardSection;
Card.Item = CardItem;
Card.Image = CardImage;
export default Card;
