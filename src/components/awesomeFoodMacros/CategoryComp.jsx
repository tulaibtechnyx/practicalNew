import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import Mealdetails from "../mealDetails"
import styles from "../tabs/style.module.scss"

export default function CategoryComponent({
  categoryData,
  loading,
  boxHide,
  currentType
}) {
  const { meal } = categoryData

  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    if (meal.length === 0) {
      setIsEmpty(true)
    } else {
      setIsEmpty(false)
    }
  }, [categoryData])

  return (
    <div className={styles.mealDetailWrapper}>
      {!loading ? (
        <div className="container container--custom">
          {meal?.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap"
              }}
              className={styles.mealWrap}
            >
              {meal.map((meal, index) => (
                <Mealdetails
                  boxHide={boxHide}
                  isStatic={true}
                  key={index}
                  meal={meal}
                />
              ))}
            </div>
          ) : (
            !isEmpty && <p style={{ textAlign: "center" }}>Loading</p>
          )}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>Loading</p>
      )}

      {isEmpty && !loading && (
        <p style={{ textAlign: "center " }}>
          No {currentType === "snack" ? "Snacks" : "Meals"} Found
        </p>
      )}
    </div>
  )
}
