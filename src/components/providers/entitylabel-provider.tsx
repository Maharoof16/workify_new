"use client";
import { useEntityLabel } from "@/modules/config/entity-labels/use-entitylabels";
import { Resource } from "@/modules/global";
import React, { createContext, useContext, useMemo } from "react";


export type EntityLabelMap = Record<
  Resource,
  { singular: string; plural: string }
>;

type EntityLabelContextType = {
  labels: EntityLabelMap;
  loaded: boolean;
};

const DEFAULT_LABELS: EntityLabelMap = {
  USER: { singular: "User", plural: "Users" },
  CLIENT: { singular: "Client", plural: "Clients" },
  DEPARTMENT: { singular: "Department", plural: "Departments" },
  PROJECT: { singular: "Project", plural: "Projects" },
  LOCATION: { singular: "Location", plural: "Locations" },
  TASK: { singular: "Task", plural: "Tasks" },
  TIMESHEET: { singular: "Timesheet", plural: "Timesheets" },
  ASSET: { singular: "Asset", plural: "Assets" },
  METADATA: { singular: "Metadata", plural: "Metadata" },
  PERFORMANCE_REVIEW: {
    singular: "Performance Review",
    plural: "Performance Review",
  },
  COMPETENCY: { singular: "Competency", plural: "Competencies" },
  RESOURCE_ALLOCATION: { singular: "Resource Allocate", plural: "Resource Allocate" },
};

const EntityLabelContext = createContext<EntityLabelContextType>({
  labels: DEFAULT_LABELS,
  loaded: false,
});

export function EntityLabelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { list, loading } = useEntityLabel();

  const labels = useMemo(() => {
    if (!list?.length) return DEFAULT_LABELS;

    const map = { ...DEFAULT_LABELS };

    for (const item of list) {
      map[item.resource] = {
        singular: item.singularLabel,
        plural: item.pluralLabel,
      };
    }

    return map;
  }, [list]);

  return (
    <EntityLabelContext.Provider
      value={{
        labels,
        loaded: !loading,
      }}
    >
      {children}
    </EntityLabelContext.Provider>
  );
}

export function useEntityLabels() {
  return useContext(EntityLabelContext).labels;
}

export function useEntityLabelsStatus() {
  return useContext(EntityLabelContext).loaded;
}
