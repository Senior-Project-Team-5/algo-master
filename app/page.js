import React from 'react';
import Link from "next/link";
import styles from './page.module.css'; // Make sure this CSS file is correctly located
import {Button } from "@/components/ui/button";

export default function HomePage() {
    return (
      <div className={styles.main}>
        <div className={styles.sidenav}>
            <Link className="navbar-brand" href="/">
                <img src="/logo.png" className={styles.Logo} />
            </Link>

            <ul className={styles.navbarnav}>
              <li className={styles.navitem}>
                <Button size="lg" variant="ghost" className={styles.button}>
                  <img src="/Home.png" className={styles.icon} width={30} height={30}/>
                  Home
                </Button>
              </li>
              <li className={styles.navitem}>
                <Button size="lg" variant="ghost" className={styles.button}>
                  <img src="/Roadmap.png" className={styles.icon} width={30} height={30}/>
                  Roadmap
                </Button>
              </li>
              <li className={styles.navitem}>
                <Button size="lg" variant="ghost" className={styles.button}>
                  <img src="/game.png" className={styles.icon} width={20} height={20}/>
                  Games
                </Button>
              </li>
              <li className={styles.navitem}>
                <Button size="lg" variant="ghost" className={styles.button}>
                  <img src="/Leaderboard.png" className={styles.icon} width={30} height={30}/>
                  Leaderboard
                </Button>
              </li>
            </ul>

            <Button size="lg" variant="ghost" className={`${styles.button} ${styles.separate}`} >
              <div className='{styles.separate}'>
                Settings
              </div>
            </Button>
        </div>

        <div className={styles.bubbleroad}>
        </div>

        <div className={styles.otherbar}>
          {/* icon, my progess bar, leaderboard mini box */}
          <div className={styles.pfp}>
            <img className={styles.pfpimg} src="/User.png"/>
          </div>

          <div className={styles.progressbar}>
            <h1>My Progress</h1>
            {/* my progess bar */}
          </div>

          <div className={styles.minilead}>
            <h1>Leaderboard</h1>
          </div>
        </div>
        
      </div>
    )
}
