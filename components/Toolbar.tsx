"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CVState, DetailLevel, TechLevel, SectionKey } from "@/lib/types";

const DETAIL_LEVELS: DetailLevel[] = ["compact", "standard", "full"];
const TECH_LEVELS: TechLevel[] = ["none", "names", "purpose", "rationale"];

const SECTION_LABELS: Record<SectionKey, string> = {
  skills: "Skills",
  certifications: "Certs",
  experience: "Experience",
  academic: "Academic",
  education: "Education",
};

interface ToolbarProps {
  state: CVState;
  allCategories: string[];
  allJobTags: string[];
  onDetailChange: (level: DetailLevel) => void;
  onTechChange: (level: TechLevel) => void;
  onFilterChange: (filter: string[]) => void;
  onJobFilterChange: (filter: string[]) => void;
  onSectionReorder: (order: SectionKey[]) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex flex-col rounded border border-gray-200 dark:border-gray-600 overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-2.5 py-1.5 text-xs text-left transition-colors ${
              value === opt
                ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function SortableItem({ id, label }: { id: SectionKey; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 px-2.5 py-1.5 bg-white dark:bg-gray-800 border-b last:border-b-0 border-gray-200 dark:border-gray-600 select-none cursor-grab active:cursor-grabbing"
    >
      <span className="text-gray-300 dark:text-gray-600 text-xs leading-none">⠿</span>
      <span className="text-xs text-gray-700 dark:text-gray-200">{label}</span>
    </div>
  );
}

export default function Toolbar({
  state,
  allCategories,
  allJobTags,
  onDetailChange,
  onTechChange,
  onFilterChange,
  onJobFilterChange,
  onSectionReorder,
  theme,
  onThemeToggle,
}: ToolbarProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = state.sectionOrder.indexOf(active.id as SectionKey);
      const newIndex = state.sectionOrder.indexOf(over.id as SectionKey);
      onSectionReorder(arrayMove(state.sectionOrder, oldIndex, newIndex));
    }
  }

  function selectCategory(cat: string) {
    if (state.techFilter.length === 1 && state.techFilter[0] === cat) {
      onFilterChange([]);
    } else {
      onFilterChange([cat]);
    }
  }

  function addCategory(cat: string) {
    if (state.techFilter.includes(cat)) {
      onFilterChange(state.techFilter.filter((c) => c !== cat));
    } else {
      onFilterChange([...state.techFilter, cat]);
    }
  }

  function selectJobTag(tag: string) {
    if (state.jobFilter.length === 1 && state.jobFilter[0] === tag) {
      onJobFilterChange([]);
    } else {
      onJobFilterChange([tag]);
    }
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex flex-col gap-5">
        <SegmentedControl
          label="Detail"
          options={DETAIL_LEVELS}
          value={state.detailLevel}
          onChange={onDetailChange}
        />

        <SegmentedControl
          label="Tech"
          options={TECH_LEVELS}
          value={state.techLevel}
          onChange={onTechChange}
        />

        {allCategories.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filter</span>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => onFilterChange([])}
                  className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                    state.techFilter.length === 0
                      ? "bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:border-gray-200"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  all
                </button>
                {allCategories.map((cat) => {
                  const active = state.techFilter.includes(cat);
                  return (
                    <span key={cat} className={`flex rounded border overflow-hidden transition-colors ${active ? "border-gray-800 dark:border-gray-300" : "border-gray-200 dark:border-gray-600"}`}>
                      <button
                        onClick={() => selectCategory(cat)}
                        title="Select only this filter"
                        className={`px-2 py-0.5 text-xs transition-colors ${
                          active
                            ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                      <button
                        onClick={() => addCategory(cat)}
                        title={active ? "Remove from selection" : "Add to selection"}
                        className={`px-1.5 py-0.5 text-xs border-l transition-colors ${
                          active
                            ? "bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 border-gray-600 dark:border-gray-400 hover:bg-gray-600 dark:hover:bg-gray-400"
                            : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                      >
                        {active ? "−" : "+"}
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Click to select · + to add</p>
          </div>
        )}

        {allJobTags.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Roles</span>
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => onJobFilterChange([])}
                className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                  state.jobFilter.length === 0
                    ? "bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:border-gray-200"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                all
              </button>
              {allJobTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => selectJobTag(tag)}
                  className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                    state.jobFilter.includes(tag)
                      ? "bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:border-gray-200"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sections</span>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={state.sectionOrder} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col rounded border border-gray-200 dark:border-gray-600 overflow-hidden">
                {state.sectionOrder.map((key) => (
                  <SortableItem key={key} id={key} label={SECTION_LABELS[key]} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <button
          onClick={onThemeToggle}
          className="w-full px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === "light" ? "☾ Dark" : "☀ Light"}
        </button>

        <button
          onClick={() => window.print()}
          className="w-full px-3 py-1.5 text-xs bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
        >
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
