import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import TextField from "react-native-ui-lib/src/components/textField";
import Image from "react-native-ui-lib/src/components/image";
import { useGetCharList } from "./hooks/api/useGet";
import { Gender, genderArr, Status, statusArr } from "./models/character";
import Picker from "react-native-ui-lib/src/components/picker";
import { useRouter } from "expo-router";

export default function Index() {
  const [name, setName] = useState<string>();
  const [status, setStatus] = useState<Status>();
  const [species, setSpecies] = useState<string>();
  const [gender, setGender] = useState<Gender>();
  const [type, setType] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const { callApi, data, isLoading } = useGetCharList({
    name,
    status,
    type,
    species,
    gender,
    page,
  });

  const router = useRouter();

  const handleSearch = () => {
    callApi();
  };

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
      setHasSearched(true);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <TextField
        style={styles.searchInput}
        placeholder="Fitler by name..."
        value={name}
        onSubmitEditing={handleSearch}
        onChangeText={setName}
      />
      <TextField
        style={styles.searchInput}
        placeholder="Filter by species"
        value={species}
        onSubmitEditing={handleSearch}
        onChangeText={setSpecies}
      />

      <TextField
        style={styles.searchInput}
        placeholder="Filter by type"
        value={type}
        onSubmitEditing={handleSearch}
        onChangeText={setType}
      />

      <Picker
        placeholder="Filter by status (alive, dead, unknown)"
        value={status}
        onChange={(items) => setStatus(items?.toString())}
        mode={Picker.modes.SINGLE}
        selectionLimit={3}
        items={statusArr}
      />
      <Picker
        placeholder="Filter by gender"
        value={gender}
        onChange={(items) => setGender(items?.toString())}
        mode={Picker.modes.SINGLE}
        selectionLimit={3}
        items={genderArr}
      />
      <Button title="Rechercher" onPress={handleSearch} disabled={isLoading} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {hasSearched &&
          (!data || !data?.results || data.results.length === 0) ? (
            <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>
          ) : (
            <>
              <FlatList
                data={data?.results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/charDetail",
                        params: { id: item.id },
                      })
                    }
                  >
                    <View style={styles.item}>
                      <Image
                        width={50}
                        height={50}
                        source={{ uri: item.image }}
                      />
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text>Status: {item.status}</Text>
                      <Text>Type: {item.type}</Text>
                      <Text>Species: {item.species}</Text>
                      <Text>Gender: {item.gender}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
              <View style={styles.pagination}>
                <Button
                  title="Previous"
                  onPress={prevPage}
                  disabled={page === 1}
                />
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
  noResultsText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
});
