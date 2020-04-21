import React from 'react';
import {
  Alert,
  Platform, 
  Button, 
  Text,
  TextInput, 
  StyleSheet, 
  View, 
  TouchableWithoutFeedback, 
  Dimensions, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import CreatButton from './Button';
import base64 from 'base-64';
import {
  createAppContainer,
  DrawerNavigator,
  HeaderNavigationBar,
  StackNavigator,
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import Logactivity from './Logactivity';
import currentDay from './currentDay';
import Activity from './Activity';
import Meals from './Meals';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import moment from "moment";


const bottomNav =  createAppContainer (
    createBottomTabNavigator(
    {
      CurrDay: currentDay,
      Active: Activity,
      Meal: Meals
    },
    {
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }, 
      animationEnabled: true,
    }
));

const stackNav = createAppContainer(
    createStackNavigator({
    First: {
      screen: bottomNav,
      navigationOptions: ({ navigation, screenProps}) => ({
        title: "Welcome Back " + screenProps.username + " !",
        headerLeft: <HamburgerIcon navigationProps={navigation}/>,
        headerStyle: {
          backgroundColor: 'gray',
        },
        headerTintColor: '#fff',
      }),
    },
}));


class HamburgerIcon extends React.Component {
    toggleDrawer = () => {
      this.props.navigationProps.toggleDrawer();
    };
  
    render() {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
            {/* <Ionicons name={Platform.OS === "ios"?"ios-person":"md-person" } size={25} /> */}
            <Image
              source={{
                uri:
                  'https://reactnativecode.com/wp-content/uploads/2018/04/hamburger_icon.png',
              }}
              style={{ width: 25, height: 25, marginLeft: 15 }}
            />
          </TouchableOpacity>
        </View>
      );
    }
}

class Settingspage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      errorMessage: "",
    }
  }
  
  componentDidMount() {
    // On mount, do the first update
    this.updateFromApi(); // Function that updates component from fetch
    // Subscribe that same function to focus events on the component in the future
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
       this.updateFromApi();
    });
   }
   
  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  updateFromApi() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", this.props.screenProps.accesscode);
    
    
    
    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow', 
    };

    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.screenProps.username, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.setState({userProfile: result});
        this.setState({errorMessage: result.message});
      })
      .catch(error => this.setState({errorMessage: "hellosdasd"}));
  }
  
  
  render() {
  return (
      <View>
        <Logactivity  
          data={this.state.userProfile} 
          accesscode={this.props.screenProps.accesscode}
          username={this.props.screenProps.username} 
          width={Math.round(Dimensions.get('window').width)} 
          height={Math.round(Dimensions.get('window').height)} 
          /> 
           
      </View>
  );
}
}

const stackNav2 = createAppContainer (
  createStackNavigator({
  Second: {
    screen: Settingspage,
    navigationOptions: ({ navigation, screenProps}) => ({
      title: "Welcome Back " + screenProps.username + " !",
      headerLeft: <HamburgerIcon navigationProps={navigation}/>,
      headerStyle: {
        backgroundColor: 'gray',
      },
      headerTintColor: '#fff',
    }),
  },
}));




export default createAppContainer (
    createDrawerNavigator(
    {
        Home: {
            screen: stackNav,
        },
        Settings: {
            screen: stackNav2,
        }
    },
    {
        contentComponent:(props) => (
            <View style={{flex:1}}>
                <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                    <DrawerItems {...props} />
                    <Button color = "red" title="Delete User" onPress={() => { props.screenProps.delete() }}/>
                    <Button color = "red" title="Logout" onPress={() => { props.screenProps.hide() }}/>
                </SafeAreaView>
            </View>
        ),
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
        drawerWidth: 200
    }));


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    paddingBottom: 10,
    
  },
  story: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
    backgroundColor: 'gray'
  },
  sectionHeading: {
    margin: 8,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#116bd1',
  },
  storyHeading: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
  },
});
    