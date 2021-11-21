package app.croma;

import static app.croma.Colors.parse;
import static org.assertj.core.api.Assertions.*;

import com.google.common.collect.Lists;
import java.util.Collections;
import org.junit.Test;

public class ColorsTest {

  @Test
  public void parse_testBasicHexCodes() {
    assertThat(parse("some random text")).isEqualTo(Collections.emptyList());
    assertThat(parse("#adadab")).isEqualTo(Lists.newArrayList("#adadab"));
    assertThat(parse("#adadab#111111#gh1111")).isEqualTo(Lists.newArrayList("#adadab", "#111111"));
    assertThat(parse("#ADADAD#111111#gh1111")).isEqualTo(Lists.newArrayList("#ADADAD", "#111111"));
  }
}
