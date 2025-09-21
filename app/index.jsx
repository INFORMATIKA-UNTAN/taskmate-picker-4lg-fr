import { useIsFocused } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, SafeAreaView, SectionList, StyleSheet, Text, View } from 'react-native';
import AddCategoryModal from '../src/components/AddCategoryModal';
import FilterToolbarFancy from '../src/components/FilterToolbarFancy';
import TaskItem from '../src/components/TaskItem';
import { pickColor } from '../src/constants/categories';
import { weightOfPriority } from '../src/constants/priorities';
import { loadCategories, saveCategories } from '../src/storage/categoryStorage';
import { clearTasks, loadTasks, saveTasks } from '../src/storage/taskStorage';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  // filters
  const [statusFilter, setStatusFilter] = useState('all');   // all | todo | done
  const [categoryFilter, setCategoryFilter] = useState('all'); // all | category
  const [priorityFilter, setPriorityFilter] = useState('all'); // all | High|Medium|Low

  const [showCatModal, setShowCatModal] = useState(false);
  const isFocused = useIsFocused();

  // reload tasks + categories setiap kali tab Home aktif
  useEffect(() => {
    if (isFocused) {
      (async () => {
        setTasks(await loadTasks());
        setCategories(await loadCategories());
      })();
    }
  }, [isFocused]);

  // toggle status
  const handleToggle = async (task) => {
    const updated = tasks.map(t =>
      t.id === task.id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t
    );
    setTasks(updated);
    await saveTasks(updated);
  };

  // delete with confirm
  const handleDelete = async (task) => {
    Alert.alert('Konfirmasi', 'Hapus tugas ini?', [
      { text: 'Batal' },
      {
        text: 'Ya',
        onPress: async () => {
          const updated = tasks.filter(t => t.id !== task.id);
          setTasks(updated);
          await saveTasks(updated);
        },
      },
    ]);
  };

  const doneCount = useMemo(() => tasks.filter(t => t.status === 'done').length, [tasks]);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const overdueCount = useMemo(
    () => tasks.filter(t => t.deadline && t.deadline < today && t.status !== 'done').length,
    [tasks, today]
  );

  const handleClearDone = () => {
    if (!doneCount) {
      Alert.alert('Info', 'Tidak ada tugas Done.');
      return;
    }
    Alert.alert('Hapus Tugas Selesai', `Yakin hapus ${doneCount} tugas selesai?`, [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const kept = tasks.filter(t => t.status !== 'done');
          setTasks(kept);
          await saveTasks(kept);
        },
      },
    ]);
  };

  const handleClearAll = () => {
    if (!tasks.length) {
      Alert.alert('Info', 'Daftar tugas kosong.');
      return;
    }
    Alert.alert('Konfirmasi', 'Hapus semua tugas?', [
      { text: 'Batal' },
      {
        text: 'Ya',
        onPress: async () => {
          setTasks([]);
          await clearTasks();
        },
      },
    ]);
  };

  // filters applied
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const byStatus =
        statusFilter === 'all' ||
        (statusFilter === 'todo' ? t.status !== 'done' : t.status === 'done');

      const byCategory =
        categoryFilter === 'all' || (t.category ?? 'Umum') === categoryFilter;

      const byPriority =
        priorityFilter === 'all' || (t.priority ?? 'Low') === priorityFilter;

      return byStatus && byCategory && byPriority;
    });
  }, [tasks, statusFilter, categoryFilter, priorityFilter]);

  // sort: priority weight desc, then deadline ascending (closest first)
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      const wa = weightOfPriority(a.priority ?? 'Low');
      const wb = weightOfPriority(b.priority ?? 'Low');
      if (wa !== wb) return wb - wa;
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }, [filteredTasks]);

  // group into sections by category
  const sections = useMemo(() => {
    const map = {};
    sortedTasks.forEach(t => {
      const cat = t.category ?? 'Umum';
      if (!map[cat]) map[cat] = [];
      map[cat].push(t);
    });

    const orderedKeys = [
      ...categories.map(c => c.key),
      ...Object.keys(map).filter(k => !categories.some(c => c.key === k)),
    ].filter((v, i, a) => a.indexOf(v) === i);

    return orderedKeys
      .filter(k => map[k] && map[k].length > 0)
      .map(k => ({ title: k, data: map[k] }));
  }, [sortedTasks, categories]);

  // add category from Home modal handler
  const handleSubmitCategory = async (cat) => {
    if (categories.some(c => c.key.toLowerCase() === cat.key.toLowerCase())) {
      Alert.alert('Info', 'Nama kategori sudah ada.');
      setShowCatModal(false);
      return;
    }
    const color = cat.color || pickColor(categories.length);
    const next = [...categories, { key: cat.key, color }];
    setCategories(next);
    await saveCategories(next);
    setCategoryFilter(cat.key);
    setShowCatModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>TaskMate – Daftar Tugas</Text>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <FilterToolbarFancy
          categories={categories}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />

        <View style={styles.toolbar}>
          <Text style={styles.toolbarText}>Done: {doneCount} / {tasks.length}</Text>
          <Text style={[styles.toolbarText, { color: overdueCount ? '#dc2626' : '#334155' }]}>
            Overdue: {overdueCount}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button title="Clear Done" onPress={handleClearDone} disabled={!doneCount} />
            <Button title="Clear All" onPress={handleClearAll} />
            <Button title="＋ Kategori" onPress={() => setShowCatModal(true)} />
          </View>
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            categories={categories}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Tidak ada tugas</Text>}
      />

      <AddCategoryModal
        visible={showCatModal}
        onClose={() => setShowCatModal(false)}
        onSubmit={handleSubmitCategory}
        suggestedColor={pickColor(categories.length)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { fontSize: 20, fontWeight: '700', padding: 16 },
  toolbar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  toolbarText: { fontWeight: '600', color: '#334155' },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    paddingVertical: 8,
    color: '#0f172a',
  },
});
