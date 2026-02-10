import { List, ListItemText, Typography , ListItem} from "@mui/material"
import React from "react"
import styles from "./style.module.scss"
const Terms = () => {
  return (
    <div className="container container--custom">
      <div className="sec-padded">
        <div className={styles.termwapper}>
          <Typography
            variant="h2"
            className={styles.heading}
            sx={{ fontWeight: "600" }}
          >
            Terms & Conditions
          </Typography>
          <Typography
            sx={{ fontSize: "15px" }}
            component={"p"}
            className={styles.para}
          >
            Your health is of paramount importance. Following a PractiCal Meal
            Plan can affect your health. So please read the Terms & Conditions
            carefully.
          </Typography>
          <Typography
            sx={{ fontSize: "15px" }}
            component={"p"}
            className={styles.para}
          >
            By becoming a customer of PractiCal you acknowledge & understand the
            Terms & Conditions & agree to comply with them.
          </Typography>
          <div className="listStyle">
            <List>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                1. <span>Copyright:</span> “PractiCal” is a brand, name, concept
                & methodology that is exclusively created, owned & run by
                Practical For Catering Services L.L.C [Trade License No.
                1089644] (“PractiCal”).The brand is protected by copyright &
                intellectual property rights [Certificate Number EC-01-003879]
                Your individual PractiCal Meal Plan, its structure, all the
                Meals/Drinks contained within, plus any supporting documentation
                are created & owned by PractiCal & are protected by the same
                rights. You may not use any of the documentation or information
                provided to you by PractiCal for your own commercial purposes,
                nor share this information or documentation with others via any
                media (including but not exclusive to all Digital Media, Social
                Media, WhatsApp & other messaging services, YouTube & other
                Video Media & Print media).
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                2. <span>Ingredient Information Accuracy:</span> The Calories
                Macros per ingredient therefore each Combo are in-line with (in
                priority order) the USDA Database ( http://fdc.nal.usda.gov ),
                individual item Back-of-pack information or public-domain
                information provided by the manufacturer or specific
                restaurant/supplier/delivery company. Although PractiCal take
                care to restrict the source of the information to be from these
                sources only, the information provided in is on an ‘as is’
                basis. PractiCal cannot confirm that it is accurate, up to date,
                complete or reliable. PractiCal aim for the Calorie count of
                each serving of a Meal to vary by no more than 10% + or -.
                PractiCal aim for the grams of Carbohydrates, Protein Fats to
                vary respectively by no more than 10% + or - from the stated
                Macros.
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                3. <span>Age restrictions:</span> PractiCal is intended for use
                only by persons who are 18 years and older.
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                4. <span>Responsibilities:</span> PractiCal will recommend a
                Meal Plan that is designed to suit an individual member’s
                preferences lifestyle. It is up to that individual to follow it
                to the best of their ability. Members acknowledge that in
                undertaking this process, the ‘success’ of the Plan depends on
                all parties so success cannot be ‘guaranteed’ by PractiCal.
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                5. <span>Not Medical Advice:</span> PractiCal do not provide
                Medical advice. Always seek the advice of a Medical Professional
                or Qualified Health Provider if you have any questions about a
                Medical Condition. Before beginning any Meal Plan or Diet you
                should consult with your Personal Healthcare Provider. Do not
                start PractiCal until you have received clearance from your
                Healthcare Provider. If you know of any reason why you should
                not undertake the a PractiCal Meal Plan, including but not
                exclusive to any allergies, prior conditions, medications or
                ailments that relate to your diet or overall health please
                inform PractiCal directly in writing. PractiCal will provide
                guidance in line with UK Government Healthy Eating Guidelines.
                PractiCal are not Medical Professionals so should you feel ill
                or unwell during the Plan please contact a Medical Professional
                immediately.
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                6. <span>Indemnification:</span> You understand that the
                undertaking of this Meal Plan is at your own risk indemnify
                PractiCal from any future claims of damages, health or financial
                burdens.
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                7. <span>Liability:</span> PractiCal cannot guarantee that the
                food drink you purchase from third parties whilst following your
                Meal Plan will be free from any ingredients/compounds that you
                are allergic to or intolerant of. Furthermore, PractiCal cannot
                guarantee that the Meals delivered as part of your PractiCal
                Meal Plan will be suitable for your dietary preferences nor can
                they guarantee that the Meals on your PractiCal Meal Plan will
                be free from any all ingredients or compounds that you are
                allergic to or intolerant of. PractiCal is not liable for any
                harm or damages that come from the above or the consumption of
                any and all food drink you consume whilst following your Meal
                Plan, or how it is stored, prepared, cooked or served.
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                8. <span>Privacy Policy:</span> PractiCal may collect use the
                information you provide as described in our Privacy Policy. By
                proceeding, you confirm that PractiCal can use the information
                in line with the Privacy Policy that any information, content
                images you share with PractiCal can be used for future marketing
                purposes in all media. Where you do not wish this to be the
                case, please inform PractiCal in writing.
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                9. <span>Refunds:</span> You understand that the monies paid are
                non-refundable. You are under no obligation to renew your
                membership.
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                10. <span>Mutual Respect:</span> You commit to request not
                demand. PractiCal reserves the right to terminate your
                membership or your right to renew at any time if confronted with
                offensive or threatening behaviour or work demands that are
                beyond the agreed deliverables or quicker than the standard
                timings.
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                11. Any dispute, difference, controversy or claim arising out of
                or in connection with this agreement, including, but not limited
                to, any question regarding its existence, validity,
                interpretation, performance, discharge and applicable remedies,
                shall be subject to the exclusive jurisdiction of the Courts of
                the Dubai International Financial Centre (“the DIFC Courts”) and
                be subject to DIFC laws. The language to be used shall be
                English.
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                12.{" "}
                <span>
                Collection and Use of Email Addresses
                </span>
                <br />By using our website, you acknowledge and agree to the collection and use of your personal data as described in this disclaimer. <br /><br />

We collect email addresses from our users for the purpose of providing essential communication and updates regarding their meal orders, deliveries, payments, and other essential information. This allows us to keep our customers informed and ensure a smooth and convenient experience.<br /><br />

Please note that we prioritise the privacy and security of your personal information. We will not sell, rent or share your personal data with any third parties, except as required by law or with your explicit consent.<br /><br />

Additionally, we may occasionally send promotional emails and newsletters to our paid customers, featuring updates on new offers, products, or services. However, you have the right to opt out of receiving such communications by following the unsubscribe instructions provided in those emails at any time.<br /><br />

While we commit to taking reasonable measures to protect the confidentiality of your personal data, please be aware that no data transmission over the internet is completely secure. Therefore, we cannot guarantee the absolute security of your information during its transmission or storage on our servers.<br /><br />

By providing your email address and using our website, you understand and accept the risks associated with the transmission and storage of your personal information.<br /><br />

If you have any concerns or questions about the collection or use of your email address, please contact our customer support team for further assistance.
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                13.{" "}
                <span>
                  How do I return my PractiCal Meal Plan delivery bag?
                </span>
                <br />A lot of meal plan companies charge extra or ask for a
                deposit for delivery bags. PractiCal don't do this. But we do
                ask that you help us by leaving your previous day's bag at your
                delivery location (plus the ice packs that came with it) so we
                can easily pick it up. If you can’t return the bag/ice packs for
                the next delivery day that’s ok, we’ll pick up 2 bags the next
                time we deliver. Please note, if it’s been 3 delivery days
                without the bags being returned we’ll pause your plan & contact
                you directly.
              </ListItemText>
              </ListItem>
              <ListItem  className={styles.listWrap}>
              <ListItemText className={styles.list}>
                14.{" "}
                <span>
                  Referral Code Disclosure
                </span>
                <br />I understand that if I use an ambassador referral code, PractiCal may share certain information with the referring ambassador. This may include my name, the amount I have spent, the start and expiry date of my plan, and other relevant details related to my purchase or engagement.
              </ListItemText>
              </ListItem>
            </List>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms
