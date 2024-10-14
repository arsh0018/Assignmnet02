import { useState, useEffect, useRef, useCallback } from "react";
import { FAB } from '@rneui/themed';
import {
  Platform,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";


import { SafeAreaProvider } from "react-native-safe-area-context";
import UserAvatar from "react-native-user-avatar";

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: "column",
    paddingHorizontal: 10,
    backgroundColor: "lightblue",
    justifyContent: "center",
  },
  avatar: {
    width: 60,
    height: 55,
    borderRadius: 20,
    borderColor: "black",
    marginRight: 16,
  },
  first: {
    fontSize: 20,
  },
  last: {
    fontSize: 16,
    fontStyle: "italic",
    color: "blue",
  },
});


export default function App() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false)
  const checkFirstRender = useRef(false)

  const getUsers = useCallback((limit=10)=> {
    fetch(
       `https://random-data-api.com/api/v2/users?size=${limit}`
      )
      .then((response) => {
        if (!response.ok) {
          throw new Error("fetch is not successfull")
        }
        return response.json()
        })
        .then((data) => {
          setUsers(data)
        })
      .catch((e) => {
        console.log("Error fetching data: ", e);
      });
  },[])

  const getUser = useCallback(()=> {
    fetch(
        `https://random-data-api.com/api/v2/users`
      )
      .then((response) => {
        if (!response.ok) {
          throw new Error("fetch is not successfull")
        }
        return response.json()
        })
        .then((data) => {
          setUsers(oldArray => [...oldArray,data] )
        })
      .catch((e) => {
        console.log("Error fetching data: ", e);
      });
  },[])

  const handleReflesh = () => {
    setRefreshing(true)
    getUsers()
    setRefreshing(false)
  }


  useEffect(() => {
    getUsers();
  }, [getUsers])

  useEffect(() => {
    if (checkFirstRender.current){
      checkFirstRender.current = false; 
      return;
    }
    getUser()
  }, [getUser]);

  const renderItem = ({ item }) => (
    <View
      style={
        Platform.OS !== "ios"
          ? {
              flex: 1,
              flexDirection: "row",
              padding: 20,
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }
          : {
              flex: 1,
              flexDirection: "row-reverse",
              padding: 20,
              justifyContent: "space-between",
              borderBottomWidth: 0.5,
              borderBottomColor: "white",
            }
      }
    >
      <UserAvatar
        style={styles.avatar}
        size={45}
        name={item.first_name}
        src={item.avatar}
      />
      <View style={styles.content}>
        <Text style={styles.first}>{item.first_name}</Text>
        <Text style={styles.last}>{item.last_name}</Text>
      </View>
    </View>
  );

  const keyExtractor = (item) => item.id.toString();

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          refreshing={refreshing}
          onRefresh={handleReflesh}
        />
        <FAB
        icon={{ name: 'add', color: 'white' }}
        color="pink"
        size="large"
        placement="right"
        onPress={getUser}
      />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

