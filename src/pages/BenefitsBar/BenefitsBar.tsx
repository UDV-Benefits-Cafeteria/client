/* eslint-disable camelcase */
import { type FC, useEffect, useState } from "react";

import { TFilterParams, useGetAllBenefitQuery } from "@entity/Benefit/api/Benefit.api";
import { useGetCategoryQuery } from "@entity/Category/api/Category.api";
import { Button } from "@shared/ui/Button";
import { Checkbox } from "@shared/ui/Checkbox";
import { FiltersSidebar } from "@shared/ui/FiltersSidebar/FiltersSidebar";
import { Icon } from "@shared/ui/Icons/Icon";
import { InputContainer } from "@shared/ui/Input/InputContainer";
import { InputField } from "@shared/ui/Input/InputField";
import { InputLabel } from "@shared/ui/Input/InputLabel";
import { Text } from "@shared/ui/Text";
import { Title } from "@shared/ui/Title";
import { BarHeader } from "@widgets/BarHeader/ui/BarHeader";
import { BenefitBarView } from "@widgets/BenefitBarView/ui/BenefitBarView";

import styles from "./BenefitsBar.module.scss";

const preparePeriod = (min: number, max: number) => `gte:${min},lte:${max}`;

const getActiveCategory = (
  categoriesCheckbox: Record<
    string,
    {
      active: boolean;
      id: number;
    }
  >
) => Object.keys(categoriesCheckbox).filter(el => categoriesCheckbox[el].active);

export const BenefitsBar: FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const categories = useGetCategoryQuery(null);
  const [active, setActive] = useState<boolean | null>(null);
  const [adaptation, setAdaptation] = useState<boolean | null>(null);
  const [categoriesCheckbox, setCategoriesCheckbox] = useState<Record<string, { active: boolean; id: number }>>({});

  const [minLevel, setMinLevel] = useState<number | null>(null);
  const [maxLevel, setMaxLevel] = useState<number | null>(null);
  const [minCost, setMinCost] = useState<number | null>(null);
  const [maxCost, setMaxCost] = useState<number | null>(null);

  const toInitialState = () => {
    setActive(null);
    setAdaptation(null);
    setCategoriesCheckbox(prev =>
      Object.fromEntries(
        Object.keys(prev).map(el => [
          el,
          {
            id: prev[el].id,
            active: false,
          },
        ])
      )
    );
    setMinLevel(null);
    setMaxLevel(null);
    setMinCost(null);
    setMaxCost(null);
  };

  const [filters, setFilters] = useState<Partial<TFilterParams>>({});

  const { data: benefits } = useGetAllBenefitQuery(filters);

  useEffect(() => {
    if (categories.data)
      setCategoriesCheckbox(
        Object.fromEntries(
          categories.data.map(el => [
            el.name,
            {
              active: false,
              id: el.id,
            },
          ])
        )
      );
  }, [categories.data]);

  return (
    <>
      <BarHeader />

      <div className={styles.top}>
        <Title type={"page"}>Бар бенефитов</Title>

        <Button
          buttonType={"secondary-black"}
          onClick={() => setSidebarOpen(prev => !prev)}
          className={styles.filter_button}
        >
          <Icon
            size={"m"}
            icon={"filters"}
            className={styles.filter_button__icon}
          />

          <Text boldness={"medium"}>Все фильтры</Text>
        </Button>

        <FiltersSidebar
          title={"Все фильтры"}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        >
          <div className={styles.filter_container}>
            <div className={styles.filter_block}>
              <Title type={"element"}>Цена, UDV-coins</Title>

              <div className={styles.numbers}>
                <InputContainer>
                  <InputLabel>
                    <Text type={"description"}>От</Text>
                  </InputLabel>

                  <InputField
                    isForm={true}
                    type={"number"}
                    value={minCost}
                    placeholder={"Введите число"}
                    className={styles.numbers__input}
                    onChange={e => setMinCost(Number(e.currentTarget.value))}
                  />
                </InputContainer>

                <InputContainer>
                  <InputLabel>
                    <Text type={"description"}>До</Text>
                  </InputLabel>

                  <InputField
                    isForm={true}
                    type={"number"}
                    value={maxCost}
                    placeholder={"Введите число"}
                    className={styles.numbers__input}
                    onChange={e => setMaxCost(Number(e.currentTarget.value))}
                  />
                </InputContainer>
              </div>
            </div>

            <div className={styles.filter_block}>
              <Title type={"element"}>Уровень</Title>

              <div className={styles.numbers}>
                <InputContainer>
                  <InputLabel>
                    <Text type={"description"}>От</Text>
                  </InputLabel>

                  <InputField
                    isForm={true}
                    type={"number"}
                    value={minLevel}
                    placeholder={"Введите число"}
                    className={styles.numbers__input}
                    onChange={e => setMinLevel(Number(e.currentTarget.value))}
                  />
                </InputContainer>

                <InputContainer>
                  <InputLabel>
                    <Text type={"description"}>До</Text>
                  </InputLabel>

                  <InputField
                    isForm={true}
                    type={"number"}
                    placeholder={"Введите число"}
                    className={styles.numbers__input}
                    value={maxLevel}
                    onChange={e => setMaxLevel(Number(e.currentTarget.value))}
                  />
                </InputContainer>
              </div>
            </div>

            <div className={styles.filter_block}>
              <Title type={"element"}>Категории</Title>

              {categoriesCheckbox && (
                <div className={styles.checkbox_container}>
                  {Object.keys(categoriesCheckbox).map(el => (
                    <Checkbox
                      key={el}
                      className={styles.element}
                      value={categoriesCheckbox[el].active}
                      label={el}
                      onChange={() =>
                        setCategoriesCheckbox(prev => ({
                          ...prev,
                          [el]: { active: !prev![el].active, id: prev![el].id },
                        }))
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            <Checkbox
              className={styles.adaptation}
              onChange={() => setAdaptation(prev => !prev)}
              label={"Адаптационный период"}
              value={adaptation !== null ? adaptation : false}
            />

            <div className={styles.filter_block}>
              <Title type={"element"}>Состояние бенефита</Title>

              <div className={styles.active_container}>
                <Checkbox
                  className={styles.radio}
                  onChange={() => setActive(true)}
                  label={"Активные"}
                  value={active !== null ? active : false}
                />

                <Checkbox
                  className={styles.radio}
                  onChange={() => setActive(false)}
                  label={"Неактивные"}
                  value={active !== null ? !active : false}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              toInitialState();
              setFilters({});
            }}
            buttonType={"secondary"}
          >
            Сбросить
          </Button>

          <Button
            onClick={() =>
              setFilters({
                ...(getActiveCategory(categoriesCheckbox).length
                  ? {
                      categories: getActiveCategory(categoriesCheckbox).reduce((acc, el, index) => {
                        acc += `categories=${categoriesCheckbox[el].id}${index === getActiveCategory(categoriesCheckbox).length - 1 ? "" : "&"}`;

                        return acc;
                      }, ""),
                    }
                  : {}),
                ...(adaptation !== null ? { adaptation_required: adaptation } : {}),
                ...(active !== null ? { is_active: active } : {}),
                ...(minLevel !== null && maxLevel !== null
                  ? { min_level_cost: preparePeriod(minLevel, maxLevel) }
                  : {}),
                ...(minCost !== null && maxCost !== null ? { coins_cost: preparePeriod(minCost, maxCost) } : {}),
              })
            }
          >
            Показать
          </Button>
        </FiltersSidebar>
      </div>

      {benefits && <BenefitBarView benefits={benefits} />}
    </>
  );
};
