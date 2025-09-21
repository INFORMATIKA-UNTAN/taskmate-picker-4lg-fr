import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    SafeAreaView, StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';

function Pill({ label, value, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.pillValue} numberOfLines={1}>{value}</Text>
      <Ionicons name="chevron-down" size={16} color="#0f172a" />
    </TouchableOpacity>
  );
}

function BottomPicker({ visible, title, options = [], current, onSelect, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.sheetBackdrop}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <SafeAreaView style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <Ionicons name="close" size={22} color="#0f172a" onPress={onClose} />
          </View>

          <FlatList
            data={options}
            keyExtractor={(it) => String(it.value)}
            renderItem={({ item }) => {
              const selected = item.value === current;
              return (
                <TouchableOpacity
                  style={[styles.optionRow, selected && styles.optionRowActive]}
                  onPress={() => { onSelect?.(item.value); onClose?.(); }}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextActive]}>
                    {item.label}
                  </Text>
                  {selected ? <Ionicons name="checkmark" size={18} color="#0ea5e9" /> : null}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

/**
 * props:
 * - categories, categoryFilter, setCategoryFilter
 * - statusFilter, setStatusFilter
 * - priorityFilter, setPriorityFilter
 */
export default function FilterToolbarFancy({
  categories = [],
  categoryFilter, setCategoryFilter,
  statusFilter, setStatusFilter,
  priorityFilter, setPriorityFilter,
}) {
  const [open, setOpen] = useState(null);

  const catOptions = useMemo(() => ([
    { label: 'All Categories', value: 'all' },
    ...categories.map(c => ({ label: c.key, value: c.key }))
  ]), [categories]);

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'In Progress', value: 'todo' },
    { label: 'Done', value: 'done' },
  ];

  const prioOptions = [
    { label: 'All', value: 'all' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  const catValueText = categoryFilter === 'all' ? 'All' : categoryFilter;
  const statusValueText = statusFilter === 'all' ? 'All' : (statusFilter === 'todo' ? 'In Progress' : 'Done');
  const prioValueText = priorityFilter === 'all' ? 'All' : priorityFilter;

  return (
    <View style={styles.wrap}>
      <Pill label="Category" value={catValueText} onPress={() => setOpen('cat')} />
      <Pill label="Progress" value={statusValueText} onPress={() => setOpen('status')} />
      <Pill label="Priority" value={prioValueText} onPress={() => setOpen('prio')} />

      <BottomPicker visible={open === 'cat'} title="Choose Category" options={catOptions} current={categoryFilter} onSelect={setCategoryFilter} onClose={() => setOpen(null)} />
      <BottomPicker visible={open === 'status'} title="Set Progress" options={statusOptions} current={statusFilter} onSelect={setStatusFilter} onClose={() => setOpen(null)} />
      <BottomPicker visible={open === 'prio'} title="Set Priority" options={prioOptions} current={priorityFilter} onSelect={setPriorityFilter} onClose={() => setOpen(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 10 },
  pill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', borderRadius: 20,
    paddingVertical: 10, paddingHorizontal: 12,
    borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  pillLabel: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  pillValue: { fontSize: 13, color: '#0f172a', flex: 1, fontWeight: '700' },

  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: '60%' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  optionRow: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', flexDirection:'row', justifyContent:'space-between' },
  optionRowActive: { backgroundColor: '#e0f2fe', borderColor: '#0ea5e9' },
  optionText: { color: '#0f172a', fontWeight: '600' },
  optionTextActive: { color: '#0c4a6e' },
});
