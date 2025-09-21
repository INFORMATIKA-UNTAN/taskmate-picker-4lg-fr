import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AddCategoryModal from '../src/components/AddCategoryModal';
import { pickColor } from '../src/constants/categories';
import { PRIORITIES } from '../src/constants/priorities';
import { loadCategories, saveCategories } from '../src/storage/categoryStorage';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';

export default function Add() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString().slice(0,10));

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('Umum');
  const [showCatModal, setShowCatModal] = useState(false);

  const [priority, setPriority] = useState('Low');

  useEffect(() => {
    (async () => {
      const cats = await loadCategories();
      setCategories(cats);
      // ensure default selected exists
      if (cats.length && !cats.some(c => c.key === category)) setCategory(cats[0].key);
    })();
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Judul wajib diisi!');
      return;
    }

    const tasks = await loadTasks();
    const newTask = {
      id: uuidv4(),
      title,
      description: desc,
      deadline,
      category,
      priority,
      status: 'pending',
    };
    await saveTasks([...tasks, newTask]);

    // reset
    setTitle(''); setDesc(''); setDeadline(new Date().toISOString().slice(0,10)); setCategory('Umum'); setPriority('Low');
    router.replace('/');
  };

  const onSubmitCategory = async ({ key, color }) => {
    if (categories.some(c => c.key.toLowerCase() === key.toLowerCase())) {
      Alert.alert('Info', 'Kategori sudah ada.');
      setShowCatModal(false);
      return;
    }
    const next = [...categories, { key, color: color || pickColor(categories.length) }];
    setCategories(next);
    await saveCategories(next);
    setCategory(key);
    setShowCatModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Tugas</Text>

      <Text style={styles.label}>Judul</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Contoh: Tugas Mobile" />

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput style={[styles.input, { height: 80 }]} value={desc} onChangeText={setDesc} placeholder="Deskripsi singkat" multiline />

      <Text style={styles.label}>Deadline (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={deadline} onChangeText={setDeadline} placeholder="2025-09-14" />

      <Text style={styles.label}>Kategori</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={category} onValueChange={(val) => {
          if (val === '__ADD__') { setShowCatModal(true); return; }
          setCategory(val);
        }}>
          {categories.map(k => <Picker.Item key={k.key} label={k.key} value={k.key} />)}
          <Picker.Item label="＋ Tambah kategori…" value="__ADD__" />
        </Picker>
      </View>

      <Text style={styles.label}>Prioritas</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={priority} onValueChange={setPriority}>
          {PRIORITIES.map(p => <Picker.Item key={p} label={p} value={p} />)}
        </Picker>
      </View>

      <Button title="Simpan Tugas" onPress={handleAdd} />

      <AddCategoryModal
        visible={showCatModal}
        onClose={() => setShowCatModal(false)}
        onSubmit={onSubmitCategory}
        suggestedColor={pickColor(categories.length)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, backgroundColor:'#fff' },
  title:{ fontSize:18, fontWeight:'700', marginBottom:12 },
  label:{ marginTop:12, fontWeight:'600' },
  input:{ borderWidth:1, borderColor:'#cbd5e1', borderRadius:8, padding:10, marginTop:6 },
  pickerWrap:{ borderWidth:1, borderColor:'#cbd5e1', borderRadius:8, marginTop:6, backgroundColor:'#fff' },
});
