import {
  Action,
  ActionPanel,
  Icon,
  List,
  getPreferenceValues,
  showToast,
  Toast,
} from "@raycast/api";
import { useEffect, useState } from "react";
import { buildHelperConfig } from "./lib/config";
import { listDisplays, startHelper } from "./lib/helper";
import { formatPatternSubtitle, getAllPatterns } from "./lib/patterns";
import { loadLastSession, saveLastSession } from "./lib/session";
import type { DisplayInfo, PatternId } from "./lib/types";
import { getPatternById } from "./lib/patterns";

type Step = "pattern" | "displays";

export default function StartBreathing() {
  const prefs = getPreferenceValues<Preferences>();
  const [step, setStep] = useState<Step>("pattern");
  const [patternId, setPatternId] = useState<PatternId>(prefs.defaultPattern);
  const [displays, setDisplays] = useState<DisplayInfo[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (step !== "displays") return;
    (async () => {
      try {
        setLoading(true);
        const list = listDisplays();
        setDisplays(list);
        setError(null);

        const last = await loadLastSession();
        const validLast = last?.displayIds.filter((id) => list.some((d) => d.id === id)) ?? [];

        if (prefs.defaultDisplays === "all") {
          setSelectedIds(new Set(list.map((d) => d.id)));
        } else if (prefs.defaultDisplays === "primaryOnly") {
          const primary = list.find((d) => d.isPrimary) ?? list[0];
          setSelectedIds(primary ? new Set([primary.id]) : new Set());
        } else if (validLast.length > 0) {
          setSelectedIds(new Set(validLast));
        } else {
          const primary = list.find((d) => d.isPrimary) ?? list[0];
          setSelectedIds(primary ? new Set([primary.id]) : new Set());
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to list displays");
      } finally {
        setLoading(false);
      }
    })();
  }, [step, prefs.defaultDisplays]);

  const patterns = getAllPatterns();

  async function handleStart(displayIds: string[]) {
    if (displayIds.length === 0) {
      await showToast({ style: Toast.Style.Failure, title: "Select at least one display" });
      return;
    }
    const pattern = getPatternById(patternId);
    const config = buildHelperConfig(pattern, displayIds);
    await saveLastSession({ patternId, displayIds });
    await startHelper(config);
  }

  if (step === "pattern") {
    return (
      <List navigationTitle="Choose pattern">
        {patterns.map((pattern) => (
          <List.Item
            key={pattern.id}
            icon={Icon.Heartbeat}
            title={pattern.name}
            subtitle={formatPatternSubtitle(pattern)}
            actions={
              <ActionPanel>
                <Action
                  title="Choose Displays"
                  onAction={() => {
                    setPatternId(pattern.id);
                    setStep("displays");
                  }}
                />
              </ActionPanel>
            }
          />
        ))}
      </List>
    );
  }

  function toggleDisplay(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <List
      isLoading={loading}
      navigationTitle="Choose displays"
      searchBarPlaceholder="Filter displays..."
    >
      {error && (
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="Could not load displays"
          description={error}
        />
      )}
      <List.Section title={`Pattern: ${getPatternById(patternId).name}`}>
        <List.Item
          title="← Back to patterns"
          icon={Icon.ArrowLeft}
          actions={
            <ActionPanel>
              <Action title="Back" onAction={() => setStep("pattern")} />
            </ActionPanel>
          }
        />
      </List.Section>
      <List.Section title="Displays" subtitle={`${selectedIds.size} selected`}>
        <List.Item
          title="All displays"
          icon={Icon.Monitor}
          accessories={[{ tag: "Select all" }]}
          actions={
            <ActionPanel>
              <Action
                title="Select All"
                onAction={() => setSelectedIds(new Set(displays.map((d) => d.id)))}
              />
              <Action
                title="Start on All Displays"
                onAction={() => handleStart(displays.map((d) => d.id))}
              />
            </ActionPanel>
          }
        />
        {displays.map((display) => {
          const selected = selectedIds.has(display.id);
          return (
            <List.Item
              key={display.id}
              title={display.name}
              subtitle={`${display.width} × ${display.height}`}
              icon={selected ? Icon.CheckCircle : Icon.Circle}
              accessories={[
                display.isPrimary ? { tag: "Primary" } : undefined,
                selected ? { icon: Icon.Check } : undefined,
              ].filter(Boolean) as List.Item.Accessory[]}
              actions={
                <ActionPanel>
                  <Action
                    title={selected ? "Deselect" : "Select"}
                    onAction={() => toggleDisplay(display.id)}
                  />
                  <Action
                    title="Start Breathing"
                    onAction={() => handleStart(Array.from(selectedIds))}
                  />
                </ActionPanel>
              }
            />
          );
        })}
      </List.Section>
      <List.Section>
        <List.Item
          title="Start with selection"
          icon={Icon.Play}
          actions={
            <ActionPanel>
              <Action
                title="Start"
                onAction={() => handleStart(Array.from(selectedIds))}
              />
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
}
