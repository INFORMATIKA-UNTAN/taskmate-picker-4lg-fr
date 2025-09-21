import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colorOfName } from '../constants/categories';
import { colorOfPriority } from '../constants/priorities';

function daysBetween(todayStr, dateStr) {
  if (!dateStr) return null;
  const t = new Date(todayStr);
  const d = new Date(dateStr);
  // normalize dates to midnight
  t.setHours(0,0,0,0);
  d.setHours(0,0,0,0);
  const diff = Math.floor((d - t) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function TaskItem({ task, categories = [], onToggle, onDelete }) {
  const isDone = task.status === 'done';
  const catColor = colorOfName(task.category ?? 'Umum', categories);
  const prioColor = colorOfPriority(task.priority ?? 'Low');

  // card background by priority (light shades)
  const prioBg = task.priority === 'High' ? '#fee2e2' : (task.priority === 'Medium' ? '#fffbeb' : '#f1f5f9');

  const today = new Date().toISOString().slice(0,10);
  const daysLeft = task.deadline ? daysBetween(today, task.deadline) : null;

  return (
    <View style={[styles.card, { backgroundColor: prioBg }, isDone && styles.cardDone]}>
      <TouchableOpacity onPress={() => onToggle?.(task)} style={{ flex: 1 }}>
        <Text style={[styles.title, isDone && styles.strike]}>{task.title}</Text>

        {!!task.deadline && (
          <Text style={styles.deadline}>
            { daysLeft < 0
              ? <Text style={{ color: '#dc2626', fontWeight:'700' }}>Overdue</Text>
              : <Text style={{ color: '#065f46', fontWeight:'600' }}>Sisa {daysLeft} hari</Text>
            }  •  {task.deadline}
          </Text>
        )}

        {!!task.description && <Text style={styles.desc}>{task.description}</Text>}

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <View style={[styles.badge, { borderColor: catColor, backgroundColor: `${catColor}20` }]}>
            <Text style={[styles.badgeText, { color: catColor }]}>{task.category ?? 'Umum'}</Text>
          </View>
          <View style={[styles.badge, { borderColor: prioColor, backgroundColor: `${prioColor}20` }]}>
            <Text style={[styles.badgeText, { color: prioColor }]}>{task.priority ?? 'Low'}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Button title="🗑" onPress={() => onDelete?.(task)} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14, borderRadius: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  cardDone: { opacity: 0.7 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4, color: '#0f172a' },
  strike: { textDecorationLine: 'line-through', color: '#64748b' },
  deadline: { fontSize: 12, color: '#334155', marginBottom: 4 },
  desc: { color: '#475569' },
  badge: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 12, fontWeight: '700' },
});
