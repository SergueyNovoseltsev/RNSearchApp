import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import TextField from "react-native-ui-lib/src/components/textField";
import Image from "react-native-ui-lib/src/components/image";
import { useGetCharList } from "./hooks/api/useGet";
import { Gender, genderArr, Status, statusArr } from "./models/character";
import Picker from "react-native-ui-lib/src/components/picker";
import { useRouter } from "expo-router";
import Button from "react-native-ui-lib/src/components/button";

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
        placeholder="Fitler by name"
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

      <View style={styles.pickerContainer}>
        <View style={[styles.pickerWrapper, styles.pickerLeft]}>
          <Picker
            style={[styles.searchInput]}
            placeholder="Filter by status"
            value={status}
            onChange={(items) => setStatus(items?.toString())}
            mode={Picker.modes.SINGLE}
            items={statusArr}
          />
        </View>
        <View style={styles.pickerWrapper}>
          <Picker
            style={[styles.searchInput]}
            placeholder="Filter by gender"
            value={gender}
            onChange={(items) => setGender(items?.toString())}
            mode={Picker.modes.SINGLE}
            items={genderArr}
          />
        </View>
      </View>
      <Button
        color="white"
        style={styles.searchButton}
        label="Rechercher"
        onPress={handleSearch}
        disabled={isLoading}
      />

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
                    {/* Character info */}
                    <View style={styles.item}>
                      <View style={styles.itemHeader}>
                        <Image
                          width={80}
                          height={80}
                          source={{ uri: item.image }}
                          style={styles.itemImage}
                        />
                        <Text style={styles.itemName}>{item.name}</Text>
                      </View>
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemText}>
                          Status: {item.status}
                        </Text>
                        <Text style={styles.itemText}>Type: {item.type}</Text>
                        <Text style={styles.itemText}>
                          Species: {item.species}
                        </Text>
                        <Text style={styles.itemText}>
                          Gender: {item.gender}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
              {/* Pagination */}
              <View style={styles.pagination}>
                <Button
                  label="Previous"
                  onPress={prevPage}
                  disabled={page === 1}
                />
                <Text>
                  Page {page} / {totalPages}
                </Text>
                <Button
                  label="Next"
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
    padding: 16,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
    fontSize: 16,
    width: "100%",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pickerWrapper: {
    flex: 1,
  },
  pickerLeft: { marginRight: 5 },
  searchButton: {
    marginTop: 10,
    backgroundColor: "#6200EE",
    color: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "column",
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemImage: {
    borderRadius: 50,
    marginRight: 15,
  },
  itemName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  itemDetails: {
    marginTop: 8,
    paddingLeft: 10,
  },
  itemText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
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
    marginTop: 20,
  },
});
