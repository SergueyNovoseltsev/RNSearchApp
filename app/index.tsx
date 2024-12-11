import { Link } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
} from "react-native";
import assets from "react-native-ui-lib/src/assets";
import Icon from "react-native-ui-lib/src/components/icon";
import TextField from "react-native-ui-lib/src/components/textField";
import { Colors } from "react-native-ui-lib/src/style";
import { useGetCharList } from "./hooks/api/useGet";
import {
  Character,
  Gender,
  genderArr,
  Species,
  speciesArr,
} from "./models/character";
import Picker from "react-native-ui-lib/src/components/picker";

export default function Index() {
  const [name, setName] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [species, setSpecies] = useState<Species>();
  const [gender, setGender] = useState<Gender>();
  const [type, setType] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const { callApi, data, isLoading } = useGetCharList({
    name,
    status,
    type,
    species,
    gender,
    page,
  });
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    callApi();
  }, [name, status, species, gender, type, page]);

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  useEffect(() => {
    if (data && data?.results?.length > 0) {
      setTotalPages(data.info.pages || 1);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <TextField
        style={styles.searchInput}
        placeholder="Fitler by name..."
        value={name}
        onChangeText={setName}
      />
      <TextField
        style={styles.searchInput}
        placeholder="Filter by statuys (alive, dead, unknown)"
        value={status}
        onChangeText={setStatus}
      />

      <TextField
        style={styles.searchInput}
        placeholder="Filter by type"
        value={type}
        onChangeText={setType}
      />

      <Picker
        placeholder="Filter by species"
        value={species}
        onChange={(items) => setSpecies(items?.toString())}
        mode={Picker.modes.SINGLE}
        selectionLimit={3}
        items={speciesArr}
      />
      <Picker
        placeholder="Filter by gender"
        value={gender}
        onChange={(items) => setGender(items?.toString())}
        mode={Picker.modes.SINGLE}
        selectionLimit={3}
        items={genderArr}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={data?.results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text>Status: {item.status}</Text>
                <Text>Species: {item.species}</Text>
                <Text>Gender: {item.gender}</Text>
                <Text>Type: {item.type}</Text>
              </View>
            )}
          />
          <View style={styles.pagination}>
            <Button title="Previous" onPress={prevPage} disabled={page === 1} />
            <Text>
              Page {page} / {totalPages}
            </Text>
            <Button
              title="Next"
              onPress={nextPage}
              disabled={page === totalPages}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemName: {
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
});
